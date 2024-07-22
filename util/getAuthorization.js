const axios = require("axios");

async function getAuthorization({cookies, token, email, password}) {
    // console.log(cookies.map(cookie => `${cookie.name}=${cookie.value}`).join(';'));
    const formData = new FormData();
    formData.append('_token', token);
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

    return headersResponse
    // Parse cookie string
}

module.exports = getAuthorization;