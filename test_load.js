const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  page.on('console', msg => {
    if (msg.text().includes('Rate limit exceeded')) {
        console.log('PAGE LOG:', msg.text());
    }
  });
  await page.goto('http://localhost:8089/index.html');
  await new Promise(r => setTimeout(r, 2000));
  await browser.close();
})();
