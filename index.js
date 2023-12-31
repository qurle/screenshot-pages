import { launch } from 'puppeteer'
import { existsSync, mkdirSync, readdirSync, rmSync } from 'fs'
import { PuppeteerBlocker } from '@cliqz/adblocker-puppeteer'
import fetch from 'cross-fetch'

import params from './params.json' with { type: "json" };

const maxMobileWidth = 480
const cookieSelectors = params.cookieSelector ? params.cookieSelector :
    `[class*=cookie i], [id*=cookie i]`
const popUpSelector = params.popUpSelector ? params.popUpSelector :
    `[class*=modal i], [id*=modal i], [class*=popup i], [id*=popup i], [class*=widget i], [id*=widget i], [class*=marquiz i], [id*=marquiz i], jdiv`


function timeoutFor(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}


let timeout = 30000
if (params.waitFor?.endsWith('ms')) timeout = params.waitFor.slice(0, -2)
else if (params.waitFor?.endsWith('s')) timeout = params.waitFor.slice(0, -1) * 1000
else if (params.waitFor?.endsWith('m')) timeout = params.waitFor.slice(0, -1) * 60000

const headless = params.headless ? params.headless : "new"

function c(str) { console.log(str) }

export default async function run() {
    c('Starting browser')
    const browser = await launch({ headless: headless })
    const page = await browser.newPage()

    if (params.hideAds) {
        c('Running adblocker')
        PuppeteerBlocker.fromPrebuiltAdsAndTracking(fetch).then((blocker) => {
            blocker.enableBlockingInPage(page);
        });
    }
    c('Resolving pages')
    const links = Array.isArray(params.pages) ? params.pages : params.pages.split('/[\s]+/')
    c(`Got ${links.length} pages`)

    const path = params.path
    if (links.length > 0)
        if (!existsSync(path)) {
            c(`Creating screenshots folder at ${path}`)
            mkdirSync(path)
        }
        else if (params.cleanFolder) {
            c(`Cleaning screenshots folder ${path}`)
            readdirSync(path).forEach(f => rmSync(`${path}/${f}`, { recursive: true }));
        }
    for (let link of links) {

        if (!link.startsWith('http')) link = 'https://' + link
        const url = new URL(link)

        c(`Opening ${url.hostname}`)
        try {
            await page.goto(link, { waitUntil: 'networkidle0', timeout: Math.round(timeout * 1 / 4) })
        } catch {
            c(`Open timeouted in ${Math.round(timeout * 1 / 4)} ms, screenshoting as is`)
        }

        c(`Giving extra ${Math.round(timeout * 1 / 4)} ms to load after open`)
        await timeoutFor(Math.round(timeout * 1 / 4))

        c('Hiding cookies')
        if (params.hideCookies) {
            await page.evaluate((selector) => {
                for (const el of document.querySelectorAll(selector))
                    el.remove()
            }, cookieSelectors)
        }

        c('Hiding popups')
        if (params.hidePopups) {
            await page.evaluate((selector) => {
                for (const el of document.querySelectorAll(selector))
                    el.remove()
            }, popUpSelector)
        }

        for (let viewport of params.viewports) {

            c(`Setting viewport ${viewport}`)
            viewport = viewport.split(/[x:-×\s]+/)
            const width = viewport[0]
            const height = viewport[1]

            await timeoutFor(Math.round(timeout * 1 / 4))
            await page.setViewport({
                width: Number(viewport[0]),
                height: Number(viewport[1]),
                deviceScaleFactor: Number(params.scale[0]),
                isMobile: viewport[0] <= maxMobileWidth,
                hasTouch: viewport[0] <= maxMobileWidth
            })

            c(`Screenshoting ${url.hostname}${url.pathname} at ${width}×${height}`)
            await page.screenshot({
                path: `${params.path}/${new URL(link).hostname}@${width}×${height}.${params.format}`,
                fullPage: params.fullPage
            })
        }
    }
    c('Closing browser')
    await browser.close()
}

run()