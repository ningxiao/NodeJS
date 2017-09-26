const puppeteer = require('puppeteer');

(async() => {
    const browser = await puppeteer.launch({
        headless: false
    });
    const page = await browser.newPage();
    await page.setViewport({
        width: 1440,
        height: 1000
    });
    // Open page.
    await page.goto('https://tutorialzine.com');
    await page.screenshot({
        path: 'tutorialzine.png',
        fullPage: true
    });
    // Show search form.
    await page.click('.search-trigger');
    // Focus input field.
    await page.focus('#search-form-top input');
    await page.type('JavaScript', { delay: 500 });
    await page.evaluate(() => {
        document.querySelector("#search-form-top").submit();
    });
    // await page.type('JavaScript', { delay: 200 });
    // await page.evaluate(() => {
    //     document.querySelector("#search-form-top").submit();
    // });
    // Keep the browser open.
    // browser.close();
})();