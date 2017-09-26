const puppeteer = require('puppeteer');
(async() => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://segmentfault.com/news/frontend')
    let SfFeArticleList = await page.evaluate(() => {
        let list = [...document.querySelectorAll('.news__list .news__item-title a')]
        return list.map(el => {
            return { href: el.href.trim(), title: el.innerText }
        })
    });
    console.log(SfFeArticleList);
    await page.screenshot({
        path: 'tutorialzine.png',
        fullPage: true
    });
    //browser.close();
})();