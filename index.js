const express = require("express");
const getAuthorization = require("./util/getAuthorization");
const getCookie = require("./util/getCookie");
const getToken = require("./util/getToken");
const app = express();

app.use(express.json());
app.post("/", async (req, res) => {
    try {
        const cookie = await getCookie()
        res.status(200);
        console.log('success ============');
        res.send({
            error: false,
            ...cookie,
        });
    } catch (error) {
        res.status(500);
        res.send({
            error: true,
            message: error.message
        })
    }
});

app.post("/login", async (req, res) => {
    const { email, password, cookies, token } = req.body;
    
    try {
        const cookieLogin = await getAuthorization({cookies, token, email, password})
        res.status(200);
        res.json({
            error: false,
            ...cookieLogin
        })
    } catch (error) {
        res.status(500);
        res.json({
            error: true,
            message: error.message
        })
    }
})

app.post("/getToken", async (req, res) => {
    try {
        const { cookies } = req.body;
        const cookieLogin = await getToken(cookies)
        res.status(200);
        res.json({
            error: false,
            session: cookieLogin
        })
    } catch (error) {
        res.status(500);
        res.json({
            error: true,
            message: error.message
        })
    }
})

app.get("/", (req, res) => {
    res.json({
        error: false,
        message: "Hello Welcome to PuppteerExpressJs - this repo only for extract auth token",
        routes: [
            {
                path: '/getToken',
                method: 'POST'
            },
            {
                path: '/login',
                method: 'POST'
            },
            {
                path: '/',
                method: 'POST'
            },
        ]
    })
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
});
