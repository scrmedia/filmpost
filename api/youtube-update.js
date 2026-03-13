export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { videoId, title, description, tags, categoryId, refreshToken } = req.body;
    if (!videoId || !refreshToken) {
      return res.status(400).json({ error: 'videoId and refreshToken are required' });
    }

    // 1. Refresh access token
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

    // 2. Update video metadata via videos.update
    const updateRes = await fetch(
      'https://www.googleapis.com/youtube/v3/videos?part=snippet',
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: videoId,
          snippet: {
            title: title || '',
            description: description || '',
            tags: Array.isArray(tags) ? tags : [],
            categoryId: categoryId || '22',
          },
        }),
      }
    );

    const updateData = await updateRes.json();
    if (!updateRes.ok) {
      const errMsg = updateData.error?.message || `YouTube API error (${updateRes.status})`;
      throw new Error(errMsg);
    }

    return res.status(200).json({ success: true, videoId: updateData.id });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
