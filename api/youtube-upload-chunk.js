export const config = { api: { bodyParser: false } };

function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const { uploadUri, contentRange, contentType } = req.query;
    if (!uploadUri) return res.status(400).json({ error: 'Missing uploadUri' });

    const chunk = await getRawBody(req);

    const headers = {
      'Content-Type': contentType || 'video/mp4',
      'Content-Length': String(chunk.length),
    };
    if (contentRange) headers['Content-Range'] = contentRange;

    const ytResponse = await fetch(uploadUri, {
      method: 'PUT',
      headers,
      body: chunk,
    });

    // 308 = Resume Incomplete (chunk received, more needed)
    if (ytResponse.status === 308) {
      const range = ytResponse.headers.get('range');
      return res.status(200).json({ complete: false, range });
    }

    // 200/201 = Upload complete
    if (ytResponse.status === 200 || ytResponse.status === 201) {
      const data = await ytResponse.json();
      return res.status(200).json({ complete: true, videoId: data.id });
    }

    const errText = await ytResponse.text().catch(() => '');
    return res.status(500).json({ error: `YouTube error ${ytResponse.status}: ${errText.substring(0, 200)}` });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
