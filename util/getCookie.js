const chromium = require("@sparticuz/chromium-min");
const pt = require("puppeteer-core");
const path = require("path");

async function getCookie() {
    // Launch browser in headless mode
    const browser = await pt.launch({
        args: [...chromium.args, "--hide-scrollbars", "--disable-web-security"],
        defaultViewport: chromium.defaultViewport,
        // you have to point to a Chromium tar file here 👇
        executablePath: await chromium.executablePath(
            path.resolve(__dirname, '../chromium/chromium-v126.0.0-pack.tar')
        ),
        headless: chromium.headless,
        ignoreHTTPSErrors: true,
    });
    let base_headers;
    // Create a new page
    const page = await browser.newPage();
    // Navigate to the login page
    await page.goto("https://pamongdesa.id/login");

    // get cookie
    const cookies = await page.cookies();

    // getToken
    const lastScriptContentData = await page.evaluate(() => {
        // Get all script elements
        const scripts = document.querySelectorAll("script");
        // Get the last script element
        const lastScript = scripts[scripts.length - 1];
        // Return the content of the last script element
        const lastScriptContent = lastScript ? lastScript.innerHTML : null;
        const tokenMatch = lastScriptContent.match(/"_token":\s*"([^"]+)"/);
        return tokenMatch ? tokenMatch[1] : null;
    });
    await browser.close();

    return {
        cookies,
        token: lastScriptContentData,
    };
}

module.exports = getCookie;
