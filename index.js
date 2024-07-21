const express = require("express");
const getAuthorization = require("./util/getAuthorization");
const app = express();

app.use(express.json());
app.post("/", async (req, res) => {
    const { email, password } = req.body;
    try {
        const tokenAuth = await getAuthorization(email, password)
        res.status(200);
        console.log('success ============');
        res.send({
            error: false,
            token: tokenAuth,
        });
    } catch (error) {
        res.status(500);
        res.send({
            error: true,
            message: error.message
        })
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
