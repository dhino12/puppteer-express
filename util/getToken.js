const chromium = require("@sparticuz/chromium-min");
const pt = require("puppeteer-core");

async function getToken(headersResponse) {
    const browser = await pt.launch({
        args: [...chromium.args, "--hide-scrollbars", "--disable-web-security"],
        defaultViewport: chromium.defaultViewport,
        // you have to point to a Chromium tar file here 👇
        executablePath: await chromium.executablePath(
            "https://github.com/Sparticuz/chromium/releases/download/v126.0.0/chromium-v126.0.0-pack.tar"
        ),
        headless: chromium.headless,
        ignoreHTTPSErrors: true,
    });

    const cookiesArray = await headersResponse.map((cookie) => {
        const [nameValue, ...attributes] = cookie.split("; ");
        const [name, value] = nameValue.split("=");
        const cookieObj = { name, value };

        attributes.forEach((attr) => {
            const [key, val] = attr.split("=");
            if (key.toLowerCase() === "expires") {
                cookieObj.expires = new Date(val).getTime() / 1000;
            } else if (key.toLowerCase() === "max-age") {
                cookieObj.expires =
                    Math.floor(Date.now() / 1000) + parseInt(val, 10);
            } else if (key.toLowerCase() === "path") {
                cookieObj.path = val;
            } else if (key.toLowerCase() === "domain") {
                cookieObj.domain = val;
            } else if (key.toLowerCase() === "secure") {
                cookieObj.secure = true;
            } else if (key.toLowerCase() === "httponly") {
                cookieObj.httpOnly = true;
            } else if (key.toLowerCase() === "samesite") {
                cookieObj.samesite = val.toLowerCase();
            }

            cookieObj.domain = "pamongdesa.id";
        });

        return cookieObj;
    });

    // Create a new page
    const page2 = await browser.newPage();
    await page2.setCookie(...cookiesArray);
    // Navigate to the login page
    await page2.goto("https://pamongdesa.id/admin/dashboard", {
        waitUntil: "networkidle0",
    });

    // Wait for navigation or a specific element that appears after login
    // await page.waitForNavigation({ waitUntil: "networkidle0" });

    // OR you can wait for a specific element
    // await page.waitForSelector('selector-after-login', { timeout: 10000 });
    // Identify all script elements and get their content after login
    const scriptsContent = await page2.evaluate(() => {
        const scripts = Array.from(document.querySelectorAll("script"));
        return scripts.map((script) => script.textContent);
    });
    console.log(scriptsContent);
    const script = scriptsContent[0];

    const jsonString = script.match(/Object\.freeze\((.*)\);/)[1];
    base_headers = JSON.parse(jsonString);
    console.log("===========TOKEN AUTHORIZATION============");
    console.log(base_headers);
    await browser.close();
    return base_headers;
}

module.exports = getToken;
