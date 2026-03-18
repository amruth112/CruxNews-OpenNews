import type { SourceBias } from '../types';

export const SOURCE_BIAS_DATA: Record<string, SourceBias> = {
  // ══════════════════════ LEFT ══════════════════════
  'huffpost.com':                     { domain: 'huffpost.com', name: 'HuffPost', bias: 'left', factualReporting: 'high', country: 'US' },
  'vox.com':                          { domain: 'vox.com', name: 'Vox', bias: 'left', factualReporting: 'high', country: 'US' },
  'theintercept.com':                 { domain: 'theintercept.com', name: 'The Intercept', bias: 'left', factualReporting: 'high', country: 'US' },
  'slate.com':                        { domain: 'slate.com', name: 'Slate', bias: 'left', factualReporting: 'high', country: 'US' },
  'salon.com':                        { domain: 'salon.com', name: 'Salon', bias: 'left', factualReporting: 'mixed', country: 'US' },
  'thedailybeast.com':                { domain: 'thedailybeast.com', name: 'The Daily Beast', bias: 'left', factualReporting: 'high', country: 'US' },

  // ══════════════════════ LEFT-CENTER ══════════════════════
  'theguardian.com':                  { domain: 'theguardian.com', name: 'The Guardian', bias: 'left-center', factualReporting: 'high', country: 'UK' },
  'npr.org':                          { domain: 'npr.org', name: 'NPR', bias: 'left-center', factualReporting: 'very-high', country: 'US' },
  'aljazeera.com':                    { domain: 'aljazeera.com', name: 'Al Jazeera', bias: 'left-center', factualReporting: 'mixed', country: 'Qatar' },
  'bbc.com':                          { domain: 'bbc.com', name: 'BBC News', bias: 'left-center', factualReporting: 'high', country: 'UK' },
  'bbc.co.uk':                        { domain: 'bbc.co.uk', name: 'BBC News', bias: 'left-center', factualReporting: 'high', country: 'UK' },
  'cnn.com':                          { domain: 'cnn.com', name: 'CNN', bias: 'left-center', factualReporting: 'mostly-factual', country: 'US' },
  'nytimes.com':                      { domain: 'nytimes.com', name: 'The New York Times', bias: 'left-center', factualReporting: 'high', country: 'US' },
  'washingtonpost.com':               { domain: 'washingtonpost.com', name: 'Washington Post', bias: 'left-center', factualReporting: 'high', country: 'US' },
  'abcnews.go.com':                   { domain: 'abcnews.go.com', name: 'ABC News', bias: 'left-center', factualReporting: 'high', country: 'US' },
  'cbsnews.com':                      { domain: 'cbsnews.com', name: 'CBS News', bias: 'left-center', factualReporting: 'high', country: 'US' },
  'nbcnews.com':                      { domain: 'nbcnews.com', name: 'NBC News', bias: 'left-center', factualReporting: 'high', country: 'US' },
  'pbs.org':                          { domain: 'pbs.org', name: 'PBS NewsHour', bias: 'left-center', factualReporting: 'very-high', country: 'US' },
  'politico.com':                     { domain: 'politico.com', name: 'Politico', bias: 'left-center', factualReporting: 'high', country: 'US' },
  'time.com':                         { domain: 'time.com', name: 'TIME', bias: 'left-center', factualReporting: 'high', country: 'US' },
  'theatlantic.com':                  { domain: 'theatlantic.com', name: 'The Atlantic', bias: 'left-center', factualReporting: 'high', country: 'US' },
  'propublica.org':                   { domain: 'propublica.org', name: 'ProPublica', bias: 'left-center', factualReporting: 'very-high', country: 'US' },
  'usatoday.com':                     { domain: 'usatoday.com', name: 'USA Today', bias: 'left-center', factualReporting: 'high', country: 'US' },
  'latimes.com':                      { domain: 'latimes.com', name: 'Los Angeles Times', bias: 'left-center', factualReporting: 'high', country: 'US' },
  'businessinsider.com':              { domain: 'businessinsider.com', name: 'Business Insider', bias: 'left-center', factualReporting: 'mostly-factual', country: 'US' },
  'cnbc.com':                         { domain: 'cnbc.com', name: 'CNBC', bias: 'left-center', factualReporting: 'high', country: 'US' },
  'cbc.ca':                           { domain: 'cbc.ca', name: 'CBC News', bias: 'left-center', factualReporting: 'high', country: 'Canada' },
  'independent.co.uk':                { domain: 'independent.co.uk', name: 'The Independent', bias: 'left-center', factualReporting: 'mostly-factual', country: 'UK' },

  // ══════════════════════ CENTER ══════════════════════
  'reuters.com':                      { domain: 'reuters.com', name: 'Reuters', bias: 'center', factualReporting: 'very-high', country: 'Global' },
  'apnews.com':                       { domain: 'apnews.com', name: 'AP News', bias: 'center', factualReporting: 'very-high', country: 'Global' },
  'thehill.com':                      { domain: 'thehill.com', name: 'The Hill', bias: 'center', factualReporting: 'high', country: 'US' },
  'economist.com':                    { domain: 'economist.com', name: 'The Economist', bias: 'center', factualReporting: 'very-high', country: 'UK' },
  'newsweek.com':                     { domain: 'newsweek.com', name: 'Newsweek', bias: 'center', factualReporting: 'mostly-factual', country: 'US' },
  'axios.com':                        { domain: 'axios.com', name: 'Axios', bias: 'center', factualReporting: 'high', country: 'US' },
  'news.un.org':                      { domain: 'news.un.org', name: 'UN News', bias: 'center', factualReporting: 'very-high', country: 'Global' },
  'forbes.com':                       { domain: 'forbes.com', name: 'Forbes', bias: 'center', factualReporting: 'mostly-factual', country: 'US' },

  // ══════════════════════ RIGHT-CENTER ══════════════════════
  'foxnews.com':                      { domain: 'foxnews.com', name: 'Fox News', bias: 'right-center', factualReporting: 'mixed', country: 'US' },
  'wsj.com':                          { domain: 'wsj.com', name: 'Wall Street Journal', bias: 'right-center', factualReporting: 'high', country: 'US' },
  'telegraph.co.uk':                  { domain: 'telegraph.co.uk', name: 'The Telegraph', bias: 'right-center', factualReporting: 'high', country: 'UK' },
  'nypost.com':                       { domain: 'nypost.com', name: 'New York Post', bias: 'right-center', factualReporting: 'mixed', country: 'US' },
  'dailymail.co.uk':                  { domain: 'dailymail.co.uk', name: 'Daily Mail', bias: 'right-center', factualReporting: 'low', country: 'UK' },
  'reason.com':                       { domain: 'reason.com', name: 'Reason', bias: 'right-center', factualReporting: 'high', country: 'US' },
  'washingtonexaminer.com':           { domain: 'washingtonexaminer.com', name: 'Washington Examiner', bias: 'right-center', factualReporting: 'mostly-factual', country: 'US' },
  'washingtontimes.com':              { domain: 'washingtontimes.com', name: 'Washington Times', bias: 'right-center', factualReporting: 'mixed', country: 'US' },
  'nationalpost.com':                 { domain: 'nationalpost.com', name: 'National Post', bias: 'right-center', factualReporting: 'high', country: 'Canada' },
  'spectator.co.uk':                  { domain: 'spectator.co.uk', name: 'The Spectator', bias: 'right-center', factualReporting: 'mostly-factual', country: 'UK' },

  // ══════════════════════ RIGHT ══════════════════════
  'breitbart.com':                    { domain: 'breitbart.com', name: 'Breitbart', bias: 'right', factualReporting: 'mixed', country: 'US' },
  'dailywire.com':                    { domain: 'dailywire.com', name: 'The Daily Wire', bias: 'right', factualReporting: 'mixed', country: 'US' },
  'nationalreview.com':               { domain: 'nationalreview.com', name: 'National Review', bias: 'right', factualReporting: 'mostly-factual', country: 'US' },
  'theamericanconservative.com':      { domain: 'theamericanconservative.com', name: 'The American Conservative', bias: 'right', factualReporting: 'mostly-factual', country: 'US' },
  'thefederalist.com':                { domain: 'thefederalist.com', name: 'The Federalist', bias: 'right', factualReporting: 'mixed', country: 'US' },
  'theepochtimes.com':                { domain: 'theepochtimes.com', name: 'The Epoch Times', bias: 'right', factualReporting: 'mixed', country: 'US' },

  // ══════════════════════ INTERNATIONAL — EUROPE ══════════════════════
  'dw.com':                           { domain: 'dw.com', name: 'DW (Deutsche Welle)', bias: 'left-center', factualReporting: 'very-high', country: 'Germany' },
  'france24.com':                     { domain: 'france24.com', name: 'France24', bias: 'left-center', factualReporting: 'high', country: 'France' },
  'news.sky.com':                     { domain: 'news.sky.com', name: 'Sky News', bias: 'right-center', factualReporting: 'high', country: 'UK' },
  'rte.ie':                           { domain: 'rte.ie', name: 'RTÉ', bias: 'left-center', factualReporting: 'high', country: 'Ireland' },
  'irishtimes.com':                   { domain: 'irishtimes.com', name: 'The Irish Times', bias: 'left-center', factualReporting: 'high', country: 'Ireland' },
  'euronews.com':                     { domain: 'euronews.com', name: 'Euronews', bias: 'left-center', factualReporting: 'high', country: 'EU' },
  'politico.eu':                      { domain: 'politico.eu', name: 'Politico Europe', bias: 'center', factualReporting: 'high', country: 'EU' },
  'swissinfo.ch':                     { domain: 'swissinfo.ch', name: 'SWI swissinfo.ch', bias: 'center', factualReporting: 'very-high', country: 'Switzerland' },
  'spiegel.de':                       { domain: 'spiegel.de', name: 'Der Spiegel', bias: 'left-center', factualReporting: 'high', country: 'Germany' },
  'themoscowtimes.com':               { domain: 'themoscowtimes.com', name: 'The Moscow Times', bias: 'left-center', factualReporting: 'high', country: 'Russia' },
  'euractiv.com':                     { domain: 'euractiv.com', name: 'Euractiv', bias: 'center', factualReporting: 'high', country: 'EU' },
  'ansa.it':                          { domain: 'ansa.it', name: 'ANSA', bias: 'center', factualReporting: 'high', country: 'Italy' },
  'ekathimerini.com':                 { domain: 'ekathimerini.com', name: 'Ekathimerini', bias: 'center', factualReporting: 'high', country: 'Greece' },
  'balkaninsight.com':                { domain: 'balkaninsight.com', name: 'Balkan Insight', bias: 'left-center', factualReporting: 'high', country: 'Balkans' },
  'thenews.pl':                       { domain: 'thenews.pl', name: 'Radio Poland', bias: 'center', factualReporting: 'high', country: 'Poland' },

  // ══════════════════════ INTERNATIONAL — MIDDLE EAST ══════════════════════
  'arabnews.com':                     { domain: 'arabnews.com', name: 'Arab News', bias: 'right-center', factualReporting: 'mixed', country: 'Saudi Arabia' },
  'jpost.com':                        { domain: 'jpost.com', name: 'The Jerusalem Post', bias: 'right-center', factualReporting: 'mostly-factual', country: 'Israel' },
  'middleeasteye.net':                { domain: 'middleeasteye.net', name: 'Middle East Eye', bias: 'left-center', factualReporting: 'mostly-factual', country: 'UK' },
  'trtworld.com':                     { domain: 'trtworld.com', name: 'TRT World', bias: 'right-center', factualReporting: 'mixed', country: 'Turkey' },
  'gulfnews.com':                     { domain: 'gulfnews.com', name: 'Gulf News', bias: 'right-center', factualReporting: 'mixed', country: 'UAE' },
  'dailysabah.com':                   { domain: 'dailysabah.com', name: 'Daily Sabah', bias: 'right-center', factualReporting: 'mixed', country: 'Turkey' },
  'aa.com.tr':                        { domain: 'aa.com.tr', name: 'Anadolu Agency', bias: 'right-center', factualReporting: 'mixed', country: 'Turkey' },

  // ══════════════════════ INTERNATIONAL — ASIA-PACIFIC ══════════════════════
  'timesofindia.indiatimes.com':      { domain: 'timesofindia.indiatimes.com', name: 'Times of India', bias: 'right-center', factualReporting: 'mixed', country: 'India' },
  'scmp.com':                         { domain: 'scmp.com', name: 'South China Morning Post', bias: 'left-center', factualReporting: 'high', country: 'Hong Kong' },
  'nhk.or.jp':                        { domain: 'nhk.or.jp', name: 'NHK World', bias: 'center', factualReporting: 'very-high', country: 'Japan' },
  'channelnewsasia.com':              { domain: 'channelnewsasia.com', name: 'Channel News Asia', bias: 'center', factualReporting: 'high', country: 'Singapore' },
  'thehindu.com':                     { domain: 'thehindu.com', name: 'The Hindu', bias: 'left-center', factualReporting: 'high', country: 'India' },
  'ndtv.com':                         { domain: 'ndtv.com', name: 'NDTV', bias: 'left-center', factualReporting: 'high', country: 'India' },
  'hindustantimes.com':               { domain: 'hindustantimes.com', name: 'Hindustan Times', bias: 'right-center', factualReporting: 'mostly-factual', country: 'India' },
  'indianexpress.com':                { domain: 'indianexpress.com', name: 'The Indian Express', bias: 'left-center', factualReporting: 'high', country: 'India' },
  'thewire.in':                       { domain: 'thewire.in', name: 'The Wire', bias: 'left-center', factualReporting: 'high', country: 'India' },
  'scroll.in':                        { domain: 'scroll.in', name: 'Scroll.in', bias: 'left-center', factualReporting: 'high', country: 'India' },
  'indiatoday.in':                    { domain: 'indiatoday.in', name: 'India Today', bias: 'right-center', factualReporting: 'mostly-factual', country: 'India' },
  'dawn.com':                         { domain: 'dawn.com', name: 'Dawn', bias: 'left-center', factualReporting: 'high', country: 'Pakistan' },
  'japantimes.co.jp':                 { domain: 'japantimes.co.jp', name: 'The Japan Times', bias: 'center', factualReporting: 'high', country: 'Japan' },
  'koreaherald.com':                  { domain: 'koreaherald.com', name: 'The Korea Herald', bias: 'center', factualReporting: 'high', country: 'South Korea' },
  'bangkokpost.com':                  { domain: 'bangkokpost.com', name: 'Bangkok Post', bias: 'center', factualReporting: 'high', country: 'Thailand' },
  'thediplomat.com':                  { domain: 'thediplomat.com', name: 'The Diplomat', bias: 'center', factualReporting: 'high', country: 'Global' },
  'taipeitimes.com':                  { domain: 'taipeitimes.com', name: 'Taipei Times', bias: 'center', factualReporting: 'high', country: 'Taiwan' },
  'rappler.com':                      { domain: 'rappler.com', name: 'Rappler', bias: 'left-center', factualReporting: 'high', country: 'Philippines' },
  'vnexpress.net':                    { domain: 'vnexpress.net', name: 'VnExpress International', bias: 'center', factualReporting: 'mostly-factual', country: 'Vietnam' },
  'asiatimes.com':                    { domain: 'asiatimes.com', name: 'Asia Times', bias: 'center', factualReporting: 'mostly-factual', country: 'Hong Kong' },
  'thedailystar.net':                 { domain: 'thedailystar.net', name: 'The Daily Star', bias: 'center', factualReporting: 'high', country: 'Bangladesh' },
  'thestar.com.my':                   { domain: 'thestar.com.my', name: 'The Star', bias: 'center', factualReporting: 'mostly-factual', country: 'Malaysia' },
  'eastasiaforum.org':                { domain: 'eastasiaforum.org', name: 'East Asia Forum', bias: 'center', factualReporting: 'high', country: 'Australia' },
  'xinhuanet.com':                    { domain: 'xinhuanet.com', name: 'Xinhua News', bias: 'left-center', factualReporting: 'mixed', country: 'China' },

  // ══════════════════════ INTERNATIONAL — AFRICA ══════════════════════
  'news24.com':                       { domain: 'news24.com', name: 'News24', bias: 'center', factualReporting: 'high', country: 'South Africa' },
  'dailymaverick.co.za':              { domain: 'dailymaverick.co.za', name: 'Daily Maverick', bias: 'left-center', factualReporting: 'high', country: 'South Africa' },
  'allafrica.com':                    { domain: 'allafrica.com', name: 'AllAfrica', bias: 'center', factualReporting: 'high', country: 'Pan-African' },
  'premiumtimesng.com':               { domain: 'premiumtimesng.com', name: 'Premium Times', bias: 'center', factualReporting: 'high', country: 'Nigeria' },
  'punchng.com':                      { domain: 'punchng.com', name: 'Punch', bias: 'center', factualReporting: 'high', country: 'Nigeria' },
  'theeastafrican.co.ke':             { domain: 'theeastafrican.co.ke', name: 'The East African', bias: 'center', factualReporting: 'high', country: 'Kenya' },
  'nation.africa':                    { domain: 'nation.africa', name: 'Nation Africa', bias: 'center', factualReporting: 'high', country: 'Kenya' },

  // ══════════════════════ INTERNATIONAL — OCEANIA ══════════════════════
  'abc.net.au':                       { domain: 'abc.net.au', name: 'ABC Australia', bias: 'left-center', factualReporting: 'very-high', country: 'Australia' },
  'nzherald.co.nz':                   { domain: 'nzherald.co.nz', name: 'New Zealand Herald', bias: 'center', factualReporting: 'high', country: 'New Zealand' },
  'rnz.co.nz':                        { domain: 'rnz.co.nz', name: 'RNZ', bias: 'center', factualReporting: 'very-high', country: 'New Zealand' },
  'smh.com.au':                       { domain: 'smh.com.au', name: 'Sydney Morning Herald', bias: 'left-center', factualReporting: 'high', country: 'Australia' },
  'sbs.com.au':                       { domain: 'sbs.com.au', name: 'SBS News', bias: 'left-center', factualReporting: 'high', country: 'Australia' },
  'stuff.co.nz':                      { domain: 'stuff.co.nz', name: 'Stuff', bias: 'center', factualReporting: 'high', country: 'New Zealand' },

  // ══════════════════════ GLOBAL ══════════════════════
  'theconversation.com':              { domain: 'theconversation.com', name: 'The Conversation', bias: 'left-center', factualReporting: 'very-high', country: 'Global' },
  'mercopress.com':                   { domain: 'mercopress.com', name: 'MercoPress', bias: 'center', factualReporting: 'high', country: 'South America' },
  'batimes.com.ar':                   { domain: 'batimes.com.ar', name: 'Buenos Aires Times', bias: 'center', factualReporting: 'high', country: 'Argentina' },
  'ticotimes.net':                    { domain: 'ticotimes.net', name: 'The Tico Times', bias: 'center', factualReporting: 'high', country: 'Costa Rica' },
  'theglobeandmail.com':              { domain: 'theglobeandmail.com', name: 'The Globe and Mail', bias: 'center', factualReporting: 'high', country: 'Canada' },
  'tass.com':                         { domain: 'tass.com', name: 'TASS', bias: 'right-center', factualReporting: 'mixed', country: 'Russia' },
};

export function getSourceBias(domain: string): SourceBias | undefined {
  // Try exact match first, then partial
  if (SOURCE_BIAS_DATA[domain]) return SOURCE_BIAS_DATA[domain];
  const key = Object.keys(SOURCE_BIAS_DATA).find(k => domain.includes(k));
  return key ? SOURCE_BIAS_DATA[key] : undefined;
}
