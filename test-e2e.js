import puppeteer from 'puppeteer';

(async () => {
  console.log("Launching browser...");
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  // Set viewport
  await page.setViewport({ width: 1280, height: 800 });

  page.on('console', msg => {
    if (msg.type() === 'error' || msg.type() === 'warning') {
      console.log(`[BROWSER ${msg.type()}] ${msg.text()}`);
    }
  });

  try {
    console.log("Navigating to http://localhost:5173 ...");
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle2', timeout: 30000 });
    
    console.log("Waiting for Onboarding modal to appear...");
    await page.waitForSelector('input[type="password"]', { visible: true });
    
    const groqApiKey = process.env.GROQ_API_KEY;
    if (!groqApiKey) {
      throw new Error('Missing GROQ_API_KEY environment variable.');
    }

    console.log("Typing Groq API Key...");
    await page.type('input[type="password"]', groqApiKey);
    
    console.log("Clicking 'Start Reading News'...");
    // Find button containing text "Start Reading News"
    const startButton = await page.evaluateHandle(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      return buttons.find(b => b.textContent && b.textContent.includes('Start Reading News'));
    });
    if (startButton) {
      await startButton.asElement()?.click();
    } else {
      console.warn("Could not find start button, trying to proceed anyway...");
    }

    console.log("Waiting for loading state to finish (Transformers.js downloading 80MB)...");
    // Wait until the loading state disappears. The loading state has text "Downloading" or "Analyzing".
    // When it finishes, .grid elements (StoryCards) should appear.
    // We will wait up to 60 seconds because downloading takes time.
    await page.waitForFunction(() => {
      const cards = document.querySelectorAll('.cursor-pointer'); 
      return cards.length > 0;
    }, { timeout: 60000 });
    
    console.log("Stories loaded! Waiting an extra 2 seconds for images...");
    await new Promise(r => setTimeout(r, 2000));
    
    console.log("Capturing Dashboard screenshot...");
    await page.screenshot({ path: 'd:/OpenNews/dashboard.png' });

    console.log("Clicking the first Story Card...");
    const firstCard = await page.$('.cursor-pointer');
    if (firstCard) {
      await firstCard.click();
      console.log("Clicked! Waiting for Story Room to open and AI to generate summary via Groq...");
      // Let's wait 10 seconds for Groq to stream the response
      await new Promise(r => setTimeout(r, 10000));
      
      console.log("Capturing Story Room screenshot...");
      await page.screenshot({ path: 'd:/OpenNews/story-room.png' });
    }

    console.log("Test completed successfully!");
  } catch (err) {
    console.error("Test failed:", err);
    await page.screenshot({ path: 'd:/OpenNews/error-state.png' }).catch(() => {});
  } finally {
    await browser.close();
  }
})();
