const axios = require("axios");
const chromium = require('@sparticuz/chromium-min');
const pt = require('puppeteer-core');

async function getAuthorization(email, password) {
    // Launch browser in headless mode
    const browser = await pt.launch({
        args: [...chromium.args, '--hide-scrollbars', '--disable-web-security'],
        defaultViewport: chromium.defaultViewport,
        // you have to point to a Chromium tar file here 👇
        executablePath: await chromium.executablePath(
            `https://github.com/Sparticuz/chromium/releases/download/v116.0.0/chromium-v116.0.0-pack.tar`
        ),
        headless: chromium.headless,
        ignoreHTTPSErrors: true,
    });
    let base_headers;
    // Create a new page
    const page = await browser.newPage();
    // Navigate to the login page
    await page.goto("https://pamongdesa.id/login");

    // Enter username and password
    // await page.type("[name='email']", email); // ganti dengan selector dan username yang sesuai
    // await page.type("[name='password']", password); // ganti dengan selector dan password yang sesuai

    // Click the login button
    // await page.click("#submitButton"); // ganti dengan selector tombol login yang sesuai

    // getScriptElement
    const lastScriptContentData = await page.evaluate(() => {
        // Get all script elements
        const scripts = document.querySelectorAll('script');
        // Get the last script element
        const lastScript = scripts[scripts.length - 1];
        // Return the content of the last script element
        const lastScriptContent = lastScript ? lastScript.innerHTML : null;
        const tokenMatch = lastScriptContent.match(/"_token":\s*"([^"]+)"/);
        return tokenMatch ? tokenMatch[1] : null;
    });

    // get cookie
    const cookies = await page.cookies();
    // console.log(cookies.map(cookie => `${cookie.name}=${cookie.value}`).join(';'));
    const formData = new FormData();
    formData.append('_token', lastScriptContentData);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('metadata[ipString]', '180.252.115.177');
    formData.append('metadata[ipNumeric]', 3036443569);
    formData.append('metadata[ipType]', 'IPv4');
    formData.append('metadata[isBehindProxy]', false);
    formData.append('metadata[device]', 'Desktop');
    formData.append('metadata[os]', 'Linux');
    formData.append('metadata[userAgent]', 'Chrome 126.0.0');
    formData.append('metadata[family]', 'Chrome');
    formData.append('metadata[versionMajor]', 126);
    formData.append('metadata[versionMinor]', 0);
    formData.append('metadata[versionPatch]', 0);
    formData.append('metadata[isSpider]', false);
    formData.append('metadata[isMobile]', false);
    formData.append('metadata[userAgentDisplay]', 'Linux Desktop Chrome 126.0.0');
    formData.append('metadata[userAgentRaw]', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36');
    formData.append('metadata[userLanguages][]', 'en-US');
    formData.append('metadata[userLanguages][]', 'en');
    formData.append('metadata[userLanguages][]', 'id');

    const headers = {
        'Cookie': cookies.map(cookie => `${cookie.name}=${cookie.value}`).join(';').replaceAll("%3D", "=")
    };

    const response = await axios.post('https://pamongdesa.id/login', formData, { headers })
    const headersResponse = await response.headers['set-cookie'];
    console.log(headersResponse);

        // Parse cookie string
    const cookiesArray = await headersResponse.map(cookie => {
        const [nameValue, ...attributes] = cookie.split('; ');
        const [name, value] = nameValue.split('=');
        const cookieObj = { name, value };

        attributes.forEach(attr => {
            const [key, val] = attr.split('=');
            if (key.toLowerCase() === 'expires') {
                cookieObj.expires = new Date(val).getTime() / 1000;
            } else if (key.toLowerCase() === 'max-age') {
                cookieObj.expires = Math.floor(Date.now() / 1000) + parseInt(val, 10);
            } else if (key.toLowerCase() === 'path') {
                cookieObj.path = val;
            } else if (key.toLowerCase() === 'domain') {
                cookieObj.domain = val;
            } else if (key.toLowerCase() === 'secure') {
                cookieObj.secure = true;
            } else if (key.toLowerCase() === 'httponly') {
                cookieObj.httpOnly = true;
            } else if (key.toLowerCase() === 'samesite') {
                cookieObj.samesite = val.toLowerCase();
            }

            cookieObj.domain = 'pamongdesa.id'
        });

        return cookieObj;
    });

    // Create a new page
    const page2 = await browser.newPage();
    await page2.setCookie(...cookiesArray);
    // Navigate to the login page
    await page2.goto("https://pamongdesa.id/admin/dashboard", { waitUntil: 'networkidle0' });

    // Wait for navigation or a specific element that appears after login
    // await page.waitForNavigation({ waitUntil: "networkidle0" });

    // OR you can wait for a specific element
    // await page.waitForSelector('selector-after-login', { timeout: 10000 });
    // Identify all script elements and get their content after login
    const scriptsContent = await page2.evaluate(() => {
        const scripts = Array.from(document.querySelectorAll("script"));
        return scripts.map((script) => script.textContent);
    });
    const script = scriptsContent[0]

    const jsonString = script.match(/Object\.freeze\((.*)\);/)[1];
    base_headers = JSON.parse(jsonString);
    console.log("===========TOKEN AUTHORIZATION============");
    console.log(base_headers);
    await browser.close();
    return base_headers
}

module.exports = getAuthorization;