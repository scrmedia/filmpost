// Keyword + SERP research via DataForSEO (same account/approach as the seo-content-writer skill).
const API = 'https://api.dataforseo.com/v3';

async function dfs(path, payload) {
  const auth = Buffer.from(`${process.env.DATAFORSEO_LOGIN}:${process.env.DATAFORSEO_PASSWORD}`).toString('base64');
  // 40104 is transient on DataForSEO's side, so retry a few times
  for (let i = 0; i < 4; i++) {
    const r = await fetch(API + path, {
      method: 'POST',
      headers: { Authorization: `Basic ${auth}`, 'Content-Type': 'application/json' },
      body: JSON.stringify([payload]),
    });
    const d = await r.json().catch(() => ({}));
    if (d.status_code === 20000) return d.tasks?.[0]?.result?.[0] || {};
    if (d.status_code !== 40104) throw new Error(`DataForSEO ${path}: ${d.status_code} ${d.status_message}`);
    await new Promise(res => setTimeout(res, 2000));
  }
  throw new Error(`DataForSEO ${path}: still unavailable after retries`);
}

const norm = (s) => (s || '').toLowerCase().replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, ' ').trim();

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { venue, area = '', location = 'United Kingdom' } = req.body || {};
  const town = area.split(',')[0].trim(); // "Tropea, Calabria, Italy" -> "Tropea"
  if (!venue) return res.status(400).json({ error: 'Missing venue' });

  const fallback = `${venue} wedding videographer`;
  const base = { location_name: location, language_code: 'en' };

  try {
    const suggest = (seed) => dfs('/dataforseo_labs/google/keyword_suggestions/live', {
      ...base, keyword: seed, limit: 100,
      filters: [['keyword_info.search_volume', '>', 0]],
      order_by: ['keyword_info.search_volume,desc'],
    }).catch(() => ({})); // small venues/towns often have no suggestion data; SERP still useful
    const [venueSug, townSug, serp] = await Promise.all([
      suggest(venue),
      town && norm(town) !== norm(venue) ? suggest(`${town} wedding`) : {},
      dfs('/serp/google/organic/live/advanced', { ...base, keyword: fallback, depth: 20 }),
    ]);

    const toRows = (r) => (r.items || []).map(i => ({
      keyword: i.keyword,
      volume: i.keyword_info?.search_volume || 0,
      kd: i.keyword_properties?.keyword_difficulty ?? null,
    }));
    // Wedding intent only; drop venue-shopping searches a videographer's post can't satisfy
    const wedding = (k) => /wedding|videograph|film/.test(k) && !/\b(prices?|costs?|hotels?|jobs?|packages?)\b/.test(k);
    // equal volume is common (Google groups variants): prefer "name ..." word order, then shortest
    const rank = (name) => (a, b) => b.volume - a.volume
      || norm(b.keyword).startsWith(name) - norm(a.keyword).startsWith(name)
      || a.keyword.length - b.keyword.length;
    const v = norm(venue), t = norm(town);
    const venueKeywords = toRows(venueSug).filter(k => norm(k.keyword).includes(v) && wedding(k.keyword)).sort(rank(v));
    const townKeywords = t ? toRows(townSug)
      .filter(k => norm(k.keyword).includes(t) && wedding(k.keyword) && !/venue/.test(k.keyword))
      .sort(rank(t)) : [];
    // ponytail: venue keyword leads (the post is about this venue); best town keyword rides along as secondary
    const primary = venueKeywords[0]?.keyword || fallback;
    const secondaryKeywords = [...new Set([fallback, townKeywords[0]?.keyword].filter(k => k && k !== primary))];
    const weddingKeywords = [...venueKeywords.slice(0, 12), ...townKeywords.slice(0, 8)];

    const questions = [], topPages = [], related = [];
    for (const it of serp.items || []) {
      if (it.type === 'organic' && topPages.length < 8) topPages.push({ domain: it.domain, title: it.title });
      if (it.type === 'people_also_ask') for (const x of it.items || []) if (x.title) questions.push(x.title.trim());
      if (it.type === 'related_searches') related.push(...(it.items || []));
    }

    res.status(200).json({
      primaryKeyword: primary,
      secondaryKeywords,
      keywords: weddingKeywords,
      questions: questions.slice(0, 8),
      related: related.slice(0, 8),
      topPages,
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
