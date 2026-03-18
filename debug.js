import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  page.on('console', msg => {
    console.log(`[BROWSER ${msg.type()}] ${msg.text()}`);
  });
  
  page.on('pageerror', err => {
    console.log(`[BROWSER ERROR] ${err.toString()}`);
  });
  
  page.on('requestfailed', request => {
    console.log(`[BROWSER NETWORK] ${request.url()} - ${request.failure()?.errorText}`);
  });

  try {
    console.log("Navigating...");
    await page.goto('http://localhost:5173', { waitUntil: 'load', timeout: 30000 });
    console.log("Waiting 5s for React to mount and fetch...");
    // Wait a bit to let React mount and fetch feeds
    await new Promise(r => setTimeout(r, 5000));
  } catch (err) {
    console.error("Navigation error:", err);
  }
  
  await browser.close();
})();
