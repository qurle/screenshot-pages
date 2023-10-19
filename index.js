import { launch } from 'puppeteer'
import { existsSync, mkdirSync } from 'fs'
import { PuppeteerBlocker } from '@cliqz/adblocker-puppeteer'
import fetch from 'cross-fetch'

import params from './params.json' with { type: "json" };

const maxMobileWidth = 480;

(async () => {
    const browser = await launch({ headless: "new" })
    const page = await browser.newPage()

    if (params.useAdblock) {
        PuppeteerBlocker.fromPrebuiltAdsAndTracking(fetch).then((blocker) => {
            blocker.enableBlockingInPage(page);
        });
    }

    const links = Array.isArray(params.pages) ? params.pages : params.pages.split('/[\s]+/')

    for (let link of links) {

        if (!link.startsWith('http')) link = 'https://' + link

        await page.goto(link, { waitUntil: 'networkidle2' })
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

            if (!existsSync(params.path)) mkdirSync(params.path)

            const url = new URL(link)
            console.log(`Screenshoting ${url.hostname}${url.pathname} at ${width}×${height}`)
            await page.screenshot({
                path: `${screenshotPath}/${new URL(link).hostname}@${width}×${height}.${params.format}`,
                fullPage: params.fullPage
            })
        }
    }
    await browser.close()
})()