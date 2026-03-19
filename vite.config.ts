import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import type { Plugin, ViteDevServer } from 'vite';

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
    return ALLOWED_DOMAINS.some(d => url.hostname === d || url.hostname.endsWith('.' + d));
  } catch {
    return false;
  }
}

function rssProxyPlugin(): Plugin {
  return {
    name: 'rss-proxy',
    configureServer(server: ViteDevServer) {
      server.middlewares.use('/api/proxy', async (req, res) => {
        const urlParam = new URL(req.url || '', 'http://localhost').searchParams.get('url');
        if (!urlParam) {
          res.statusCode = 400;
          res.end(JSON.stringify({ error: 'Missing url parameter' }));
          return;
        }

        if (!isAllowedUrl(urlParam)) {
          res.statusCode = 403;
          res.end(JSON.stringify({ error: 'Domain not in allowlist' }));
          return;
        }

        try {
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 30000);

          const response = await fetch(urlParam, {
            signal: controller.signal,
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
              'Accept': 'application/rss+xml, application/xml, text/xml, application/atom+xml, */*',
              'Accept-Language': 'en-US,en;q=0.9',
            },
          });

          clearTimeout(timeout);

          if (!response.ok) {
            res.statusCode = 502;
            res.end(JSON.stringify({ error: `Upstream returned ${response.status}` }));
            return;
          }

          const body = await response.text();
          res.setHeader('Content-Type', 'application/xml; charset=utf-8');
          res.setHeader('Cache-Control', 'max-age=300');
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.end(body);
        } catch (err: unknown) {
          res.statusCode = 502;
          const message = err instanceof Error ? err.message : 'Fetch failed';
          res.end(JSON.stringify({ error: message }));
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), rssProxyPlugin()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  build: {
    target: 'esnext',
  },
});
