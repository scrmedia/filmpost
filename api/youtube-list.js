export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { refreshToken, pageToken } = req.body;
    if (!refreshToken) return res.status(400).json({ error: 'refreshToken is required' });

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

    // 2. Get uploads playlist ID
    const channelRes = await fetch(
      'https://www.googleapis.com/youtube/v3/channels?part=contentDetails&mine=true',
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    const channelData = await channelRes.json();
    if (!channelRes.ok || !channelData.items?.length) {
      throw new Error('Could not retrieve YouTube channel');
    }
    const uploadsPlaylistId = channelData.items[0].contentDetails.relatedPlaylists.uploads;

    // 3. Fetch playlist items (video IDs + basic snippet)
    const playlistUrl = new URL('https://www.googleapis.com/youtube/v3/playlistItems');
    playlistUrl.searchParams.set('part', 'snippet');
    playlistUrl.searchParams.set('playlistId', uploadsPlaylistId);
    playlistUrl.searchParams.set('maxResults', '50');
    if (pageToken) playlistUrl.searchParams.set('pageToken', pageToken);

    const playlistRes = await fetch(playlistUrl.toString(), {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const playlistData = await playlistRes.json();
    if (!playlistRes.ok) {
      throw new Error(playlistData.error?.message || 'Failed to fetch playlist items');
    }

    const items = playlistData.items || [];
    if (items.length === 0) {
      return res.status(200).json({
        videos: [],
        nextPageToken: null,
        totalResults: 0,
      });
    }

    // 4. Batch fetch full video metadata (snippet + statistics)
    const videoIds = items
      .map(item => item.snippet?.resourceId?.videoId)
      .filter(Boolean)
      .join(',');

    const videosRes = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoIds}`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    const videosData = await videosRes.json();
    if (!videosRes.ok) {
      throw new Error(videosData.error?.message || 'Failed to fetch video metadata');
    }

    const videos = (videosData.items || []).map(v => ({
      id: v.id,
      title: v.snippet?.title || '',
      description: v.snippet?.description || '',
      thumbnailUrl:
        v.snippet?.thumbnails?.medium?.url ||
        v.snippet?.thumbnails?.default?.url ||
        '',
      publishedAt: v.snippet?.publishedAt || '',
      viewCount: v.statistics?.viewCount || '0',
      tags: v.snippet?.tags || [],
      categoryId: v.snippet?.categoryId || '22',
    }));

    return res.status(200).json({
      videos,
      nextPageToken: playlistData.nextPageToken || null,
      totalResults: playlistData.pageInfo?.totalResults || videos.length,
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
