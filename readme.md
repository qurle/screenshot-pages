# Website Screenshoter
Use this Node.js module to bulk screnshot pages with desired resolution.
## Usage
1. Install [Node.js](https://nodejs.org/en/download) if you don't have one. You need version `13.2` or higher.
2. Clone this repository from [GitHub](https://github.com/qurle/screenshot-pages) 
3. Fill `params.json` with parameters you need. You can customize format, dimensions, pixel ratio and more. Don't forget to put array of links to the needed pages.
```json
{
    "path": "./screenshots",
    "useAdblock": true,
    "viewports": [
        "1440x900",
        "360x900"
    ],
    "format": "png",
    "scale": "2x",
    "fullPage": false,
    "pages": [
        "https://google.com",
        "https://linkedin.com",
        "https://qurle.net/"
    ]
}
``` 
If you want to capture the whole page, set `fullPage: true`. Otherwise you'll get only start of the page.
4. Open your terminal and run `node /path/to/screenshot-pages/`

Your screenshots will appear in screenshot-pages directory.