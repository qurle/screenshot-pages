import { launch } from 'puppeteer'
import { existsSync, mkdirSync } from 'fs'
import { PuppeteerBlocker } from '@cliqz/adblocker-puppeteer'
import fetch from 'cross-fetch'

import params from './params.json' with { type: "json" };

const maxMobileWidth = 480
const screenshotPath = './screenshots';

(async () => {
    const browser = await launch({ headless: "new" })
    const page = await browser.newPage()

    PuppeteerBlocker.fromPrebuiltAdsAndTracking(fetch).then((blocker) => {
        blocker.enableBlockingInPage(page);
    });

    for (let link of params.pages) {

        if (!link.startsWith('http')) link = 'https://' + link

        await page.goto(link, { waitUntil: 'networkidle0' })
        for (let viewport of params.viewports) {

            viewport = viewport.split(/[x:-×\s]+/)
            const width = viewport[0]
            const height = viewport[1]

            await page.setViewport({
                width: Number(viewport[0]),
                height: Number(viewport[1]),
                deviceScaleFactor: Number(params.scale[0]),
                isMobile: viewport[0] <= maxMobileWidth,
                hasTouch: viewport[0] <= maxMobileWidth
            })

            if (!existsSync(screenshotPath)) mkdirSync(screenshotPath)

            const url = new URL(link)
            console.log(`Screenshoting ${url.hostname}${url.pathname} at ${width}×${height}`)
            await page.screenshot({
                path: `${screenshotPath}/${new URL(link).hostname}@${width}×${height}.png`,
                fullPage: params.fullPage
            })
        }
    }
    await browser.close()
})()