export const config = {
  api: { bodyParser: { sizeLimit: '10mb' } },
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const { videoId, refreshToken, imageBase64, mimeType } = req.body;
    if (!videoId || !refreshToken || !imageBase64 || !mimeType) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Refresh the access token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        refresh_token: refreshToken,
        client_id: process.env.YOUTUBE_CLIENT_ID,
        client_secret: process.env.YOUTUBE_CLIENT_SECRET,
        grant_type: 'refresh_token',
      }),
    });
    const tokenData = await tokenResponse.json();
    if (!tokenResponse.ok || tokenData.error) {
      throw new Error(tokenData.error_description || tokenData.error || 'Token refresh failed');
    }
    const accessToken = tokenData.access_token;

    // Upload thumbnail
    const imageBuffer = Buffer.from(imageBase64, 'base64');
    const thumbRes = await fetch(
      `https://www.googleapis.com/upload/youtube/v3/thumbnails/set?videoId=${encodeURIComponent(videoId)}&uploadType=media`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': mimeType,
        },
        body: imageBuffer,
      }
    );

    if (!thumbRes.ok) {
      const errData = await thumbRes.json().catch(() => ({}));
      throw new Error(errData?.error?.message || `Thumbnail upload failed: ${thumbRes.status}`);
    }

    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
