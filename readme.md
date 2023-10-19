# Website Screenshoter
Use this Node.js module to bulk screnshot pages with desired resolution.
## Usage
#### Step 1
Install [Node.js](https://nodejs.org/en/download) if you don't have one. You need version `13.2` or higher.
#### Step 2
Clone this repository from [GitHub](https://github.com/qurle/screenshot-pages) or download then unzip it.
#### Step 3
Fill `params.json` with parameters you need. You can customize format, dimensions, pixel ratio and more. Don't forget to put array of links to the needed pages.
##### Example of params.json
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
    "waitFor": "1s",
    "fullPage": false,
    "pages": [
        "https://google.com",
        "https://linkedin.com",
        "https://qurle.net/"
    ]
}
``` 
If you want to capture the whole page, set `fullPage: true`. Otherwise you'll get only start of the page.

#### Step 4
Open your terminal and run `node /path/to/screenshot-pages/`. You may need to wait for sometime, hope console message will entertain you meanwhile.

#### Voila
Your screenshots will appear in screenshot-pages directory.
