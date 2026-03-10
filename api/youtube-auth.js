export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const { action, code, refreshToken } = req.body;

    if (action === 'getAuthUrl') {
      const params = new URLSearchParams({
        client_id: process.env.YOUTUBE_CLIENT_ID,
        redirect_uri: process.env.YOUTUBE_REDIRECT_URI,
        response_type: 'code',
        scope: 'https://www.googleapis.com/auth/youtube.upload',
        access_type: 'offline',
        prompt: 'consent',
      });
      const url = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
      return res.status(200).json({ url });
    }

    if (action === 'exchangeCode') {
      const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          code,
          client_id: process.env.YOUTUBE_CLIENT_ID,
          client_secret: process.env.YOUTUBE_CLIENT_SECRET,
          redirect_uri: process.env.YOUTUBE_REDIRECT_URI,
          grant_type: 'authorization_code',
        }),
      });
      const tokenData = await tokenResponse.json();
      if (!tokenResponse.ok || tokenData.error) {
        throw new Error(tokenData.error_description || tokenData.error || 'Token exchange failed');
      }
      const { access_token, refresh_token } = tokenData;

      const channelResponse = await fetch(
        'https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true',
        {
          headers: { Authorization: `Bearer ${access_token}` },
        }
      );
      const channelData = await channelResponse.json();
      const channel_name =
        channelData.items?.[0]?.snippet?.title || 'YouTube Channel';

      return res.status(200).json({ access_token, refresh_token, channel_name });
    }

    if (action === 'refreshToken') {
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
      const { access_token } = tokenData;

      return res.status(200).json({ access_token });
    }

    return res.status(400).json({ error: 'Invalid action' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
