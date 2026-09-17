// "Watch" a wedding film in the browser: sample frames + transcribe speech, then have Claude
// describe it. Same idea as claude-video's /watch, rebuilt so nothing leaves the browser but
// small JPEGs and 16 kHz audio chunks (Vercel caps request bodies at 4.5 MB).
import { callClaude, VENUE_QUESTIONS } from "./utils";

const SAMPLE_RATE = 16000;
const CHUNK_SECONDS = 120;                      // 120 s of 16 kHz mono WAV ≈ 3.8 MB
const MAX_FRAME_BYTES = 3.8 * 1024 * 1024;   // base64 frames must fit under Vercel's 4.5 MB body limit
const MAX_AUDIO_FILE_BYTES = 4 * 1024 ** 3;     // ponytail: whole-file decode in memory (1.6 GB 4K film: 2 s); stream via WebCodecs if bigger films matter

// Same duration-based budget as claude-video's /watch (Claude accepts max 100 images per request)
const frameBudget = (secs) => secs <= 60 ? 40 : secs <= 180 ? 60 : secs <= 600 ? 80 : 100;

async function openVideo(file, width) {
  const url = URL.createObjectURL(file);
  const video = document.createElement("video");
  video.muted = true;
  video.preload = "auto";
  video.src = url;
  await new Promise((resolve, reject) => {
    video.onloadedmetadata = resolve;
    video.onerror = () => { URL.revokeObjectURL(url); reject(new Error("This browser can't read this video format (try an MP4 export).")); };
  });
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = Math.round((width * video.videoHeight) / video.videoWidth);
  const grab = async (t) => {
    await new Promise((resolve) => { video.onseeked = resolve; video.currentTime = t; });
    canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas;
  };
  return { video, grab, close: () => URL.revokeObjectURL(url) };
}

// Full-size still for the YouTube thumbnail / blog featured image (YouTube wants 1280 px, under 2 MB)
export async function captureFrame(file, t, width = 1280) {
  const { grab, close } = await openVideo(file, width);
  try {
    const canvas = await grab(t);
    return await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.9));
  } finally {
    close();
  }
}

export async function extractFrames(file, { width = 512, onProgress } = {}) {
  const { video, grab, close } = await openVideo(file, width);
  try {
    const count = frameBudget(video.duration);
    let frames = [];
    // ponytail: uniform sampling, no scene detection/dedup; edited films rarely hold a shot long
    for (let i = 0; i < count; i++) {
      const t = (video.duration * (i + 0.5)) / count;
      const canvas = await grab(t);
      frames.push({ t, data: canvas.toDataURL("image/jpeg", 0.7).split(",")[1] });
      onProgress?.(i + 1, count);
    }
    // Busy footage compresses worse; thin evenly until the request fits
    const bytes = frames.reduce((s, f) => s + f.data.length, 0);
    if (bytes > MAX_FRAME_BYTES) {
      const step = Math.ceil(bytes / MAX_FRAME_BYTES);
      frames = frames.filter((_, i) => i % step === 0);
    }
    return { duration: video.duration, frames };
  } finally {
    close();
  }
}

function encodeWav(samples) {
  const view = new DataView(new ArrayBuffer(44 + samples.length * 2));
  const str = (o, s) => [...s].forEach((c, i) => view.setUint8(o + i, c.charCodeAt(0)));
  str(0, "RIFF"); view.setUint32(4, 36 + samples.length * 2, true); str(8, "WAVE");
  str(12, "fmt "); view.setUint32(16, 16, true); view.setUint16(20, 1, true); view.setUint16(22, 1, true);
  view.setUint32(24, SAMPLE_RATE, true); view.setUint32(28, SAMPLE_RATE * 2, true);
  view.setUint16(32, 2, true); view.setUint16(34, 16, true);
  str(36, "data"); view.setUint32(40, samples.length * 2, true);
  for (let i = 0; i < samples.length; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(44 + i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }
  return new Blob([view], { type: "audio/wav" });
}

// Returns "" when there's no usable audio; speech is a bonus, never a blocker.
export async function transcribeFilm(file, { onProgress } = {}) {
  if (file.size > MAX_AUDIO_FILE_BYTES) return "";
  let pcm;
  const ctx = new AudioContext();
  try {
    const decoded = await ctx.decodeAudioData(await file.arrayBuffer());
    const offline = new OfflineAudioContext(1, Math.ceil(decoded.duration * SAMPLE_RATE), SAMPLE_RATE);
    const src = offline.createBufferSource();
    src.buffer = decoded;
    src.connect(offline.destination);
    src.start();
    pcm = (await offline.startRendering()).getChannelData(0);
  } catch (e) {
    console.warn("[FilmPost] Audio decode failed, continuing without transcript:", e.message);
    return "";
  } finally {
    ctx.close();
  }

  const step = CHUNK_SECONDS * SAMPLE_RATE;
  const total = Math.ceil(pcm.length / step);
  const parts = [];
  for (let i = 0; i < total; i++) {
    onProgress?.(i + 1, total);
    const res = await fetch("/api/transcribe", {
      method: "POST",
      headers: { "Content-Type": "application/octet-stream" },
      body: encodeWav(pcm.subarray(i * step, (i + 1) * step)),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || `Transcription failed (${res.status})`);
    const mm = String(Math.floor((i * CHUNK_SECONDS) / 60)).padStart(2, "0");
    if (data.text?.trim()) parts.push(`[${mm}:00] ${data.text.trim()}`);
  }
  return parts.join("\n");
}

const fmt = (t) => `${String(Math.floor(t / 60)).padStart(2, "0")}:${String(Math.floor(t % 60)).padStart(2, "0")}`;

const str = { type: "string" };
const strList = { type: "array", items: str };
const obj = (properties) => ({ type: "object", properties, required: Object.keys(properties), additionalProperties: false });
const ANALYSIS_SCHEMA = obj({
  venueName: str,
  venueSource: { type: "string", enum: ["filename", "speech", "visual", "unknown"] },
  answers: obj(Object.fromEntries(VENUE_QUESTIONS.map(q => [q.id, str]))),
  summary: str,
  speech: strList,
  details: strList,
  bestFrameTime: str,
  chapters: { type: "array", items: obj({ time: str, title: str }) },
});

// Claude looks at the frames + transcript and returns the questionnaire answers itself.
export async function analyseFilm({ fileName, frames, duration, transcript, venues }) {
  const library = venues.map(v => `${v.venue_name}${v.location ? ` (${v.location})` : ""}`).join("; ") || "none";
  const fields = VENUE_QUESTIONS.map(q => `- ${q.id}: ${q.label}`).join("\n");
  const content = [
    ...frames.flatMap(f => [
      { type: "text", text: `Frame at ${fmt(f.t)}` },
      { type: "image", source: { type: "base64", media_type: "image/jpeg", data: f.data } },
    ]),
    { type: "text", text: `You have just watched a ${fmt(duration)} wedding film. Above are ${frames.length} evenly spaced frames.

File name: "${fileName}"
Saved venue library: ${library}

Speech transcript from the film's audio (Whisper). Speeches and vows are usually mixed under music, so skip only the odd garbled line and use all real speech. Speech is your best source for names, places, jokes and personal moments:
${transcript || "(no speech was picked up)"}

Work out the venue. Prefer, in order: the file name (match it to the venue library if you can), then venue names spoken or shown on screen, then a visual guess. Never invent a venue.

Fill in the JSON fields:
- venueName: exact venue name, or "" if unknown. venueSource: where the name came from.
- answers: one entry per questionnaire field below.
${fields}
- summary: 4-6 sentences on what actually happens in the film, in order, with timestamps.
- speech: the most personal or memorable things said in the vows, speeches or readings, quoted as heard, with who said it if clear.
- details: specific, true details a couple would recognise: weather, season, flowers, dress, cars, readings, first dance song if named.
- bestFrameTime: the MM:SS label of the single best frame for a YouTube thumbnail. Pick the couple together, faces visible, sharp, well lit and emotional, with the setting showing if possible.
- chapters: 4-8 YouTube chapters in time order. The first is at 00:00, each at least 15 seconds after the last, titles of 2-4 plain words (e.g. "Getting ready", "The ceremony", "Speeches", "First dance").

For coupleStory, ceremonyDetails and speechHighlights, lean on the transcript: what people said about the couple, how they met, what the celebrant and vows focused on, and the 2-4 best short quotes with who said them by role.
Leave out anything sensitive everywhere (answers, speech, details): illness or diagnoses, deaths, money, family rifts, anything said in confidence. This content will be published.
Write plainly in British English. Never use em dashes or en dashes.
For each answer, describe only what you saw or heard, and fold in what was said where it fits (standoutMemory especially). Use an empty string when the film gives no evidence. coupleNames only if names are clearly spoken or shown. venueWebsite stays empty unless it appears on screen.` },
  ];
  const raw = await callClaude(
    "You are a wedding videographer reviewing your own edited film to write about it. Be literal and specific. British English.",
    content,
    { schema: ANALYSIS_SCHEMA },
  );
  return JSON.parse(raw);
}
