export const config = {
  runtime: 'edge',
  regions: ['iad1', 'sfo1', 'lhr1', 'fra1', 'sin1', 'syd1', 'hnd1'],
};

const ALLOWED_DOMAINS = [
  // ── LEFT ──
  'theguardian.com', 'feeds.npr.org', 'chaski.huffpost.com', 'vox.com',
  'aljazeera.com', 'theintercept.com', 'slate.com', 'salon.com',
  'thedailybeast.com', 'feeds.thedailybeast.com',
  // ── LEFT-CENTER ──
  'feeds.bbci.co.uk', 'rss.cnn.com', 'rss.nytimes.com',
  'feeds.washingtonpost.com', 'abcnews.go.com', 'cbsnews.com',
  'feeds.nbcnews.com', 'pbs.org', 'politico.com', 'time.com',
  'theatlantic.com', 'propublica.org', 'rss.usatoday.com',
  'latimes.com', 'feeds.businessinsider.com', 'businessinsider.com',
  'cnbc.com', 'cbc.ca', 'independent.co.uk',
  // ── CENTER ──
  'reutersagency.com', 'rsshub.app', 'thehill.com', 'economist.com',
  'newsweek.com', 'api.axios.com', 'news.un.org', 'forbes.com',
  // ── RIGHT-CENTER ──
  'moxie.foxnews.com', 'feeds.a.dj.com', 'telegraph.co.uk',
  'nypost.com', 'dailymail.co.uk', 'reason.com',
  'washingtonexaminer.com', 'washingtontimes.com',
  'nationalpost.com', 'spectator.co.uk',
  // ── RIGHT ──
  'feeds.feedburner.com', 'dailywire.com', 'nationalreview.com',
  'theamericanconservative.com', 'thefederalist.com', 'theepochtimes.com',
  // ── EUROPE ──
  'rss.dw.com', 'france24.com', 'feeds.skynews.com',
  'rte.ie', 'irishtimes.com', 'euronews.com', 'politico.eu',
  'swissinfo.ch', 'spiegel.de', 'themoscowtimes.com',
  'euractiv.com', 'ansa.it', 'ekathimerini.com',
  'balkaninsight.com', 'thenews.pl',
  // ── MIDDLE EAST ──
  'arabnews.com', 'jpost.com', 'middleeasteye.net', 'trtworld.com',
  'gulfnews.com', 'dailysabah.com', 'aa.com.tr',
  // ── ASIA-PACIFIC ──
  'timesofindia.indiatimes.com', 'scmp.com', 'www3.nhk.or.jp',
  'channelnewsasia.com', 'thehindu.com', 'hindustantimes.com',
  'indianexpress.com', 'thewire.in', 'scroll.in', 'indiatoday.in',
  'dawn.com', 'japantimes.co.jp', 'koreaherald.com',
  'bangkokpost.com', 'thediplomat.com', 'taipeitimes.com',
  'rappler.com', 'e.vnexpress.net', 'asiatimes.com',
  'thedailystar.net', 'thestar.com.my', 'eastasiaforum.org',
  'xinhuanet.com',
  // ── AFRICA ──
  'feeds.news24.com', 'news24.com', 'dailymaverick.co.za',
  'allafrica.com', 'premiumtimesng.com', 'punchng.com',
  'theeastafrican.co.ke', 'nation.africa',
  // ── OCEANIA ──
  'abc.net.au', 'nzherald.co.nz', 'rnz.co.nz', 'smh.com.au',
  'sbs.com.au', 'stuff.co.nz',
  // ── GLOBAL / LATIN AMERICA ──
  'theconversation.com', 'mercopress.com', 'en.mercopress.com',
  'batimes.com.ar', 'ticotimes.net', 'theglobeandmail.com',
  'tass.com',
];

function isAllowedUrl(urlStr: string): boolean {
  try {
    const url = new URL(urlStr);
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return false;
    // Exact match or subdomain match (prevents theguardian.com.evil.com bypass)
    return ALLOWED_DOMAINS.some(d => url.hostname === d || url.hostname.endsWith('.' + d));
  } catch {
    return false;
  }
}

export default async function handler(request: Request) {
  const url = new URL(request.url);
  const targetUrl = url.searchParams.get('url');

  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
      },
    });
  }

  if (!targetUrl) {
    return new Response(JSON.stringify({ error: 'Missing url parameter' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }

  if (!isAllowedUrl(targetUrl)) {
    return new Response(JSON.stringify({ error: 'Domain not in allowlist' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    const upstreamResponse = await fetch(targetUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'OpenNews/1.0 (RSS Reader - Edge Proxy)',
        'Accept': 'application/rss+xml, application/xml, text/xml, application/atom+xml, */*',
      },
    });

    clearTimeout(timeout);

    if (!upstreamResponse.ok) {
      return new Response(JSON.stringify({ error: `Upstream returned ${upstreamResponse.status}` }), {
        status: 502,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }

    const body = await upstreamResponse.text();

    return new Response(body, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 's-maxage=300, stale-while-revalidate',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error && err.name === 'AbortError' ? 'Request timeout' : 'Fetch failed';
    return new Response(JSON.stringify({ error: message }), {
      status: 502,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }
}
