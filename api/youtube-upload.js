export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const { title, description, tags, refreshToken } = req.body;

    // Step 1: Refresh the access token
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

    // Step 2: Initiate a resumable upload session
    const uploadResponse = await fetch(
      'https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'X-Upload-Content-Type': 'video/*',
        },
        body: JSON.stringify({
          snippet: {
            title,
            description,
            tags: tags || [],
            categoryId: '22',
          },
          status: {
            privacyStatus: 'private',
          },
        }),
      }
    );

    // Step 3: Extract the resumable upload URI from the Location header
    if (!uploadResponse.ok) {
      const errData = await uploadResponse.json().catch(() => ({}));
      throw new Error(errData?.error?.message || `Upload init failed: ${uploadResponse.status}`);
    }
    const uploadUri = uploadResponse.headers.get('location');
    if (!uploadUri) throw new Error('No upload URI returned from YouTube');

    // Step 4: Return the upload URI to the client
    return res.status(200).json({ uploadUri });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
