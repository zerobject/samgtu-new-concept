import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
app.use(cors());

app.post("/api/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        // Получаем CSRF и сессии
        const initRes = await fetch("https://lk.samgtu.ru/site/login", {
            method: "GET",
            headers: {
                "User-Agent": "Mozilla/5.0",
            },
        });

        const cookies = initRes.headers.raw()["set-cookie"];
        const html = await initRes.text();

        const csrfToken = /name="_csrf" value="(.+?)"/.exec(html)?.[1];
        if (!csrfToken) return res.status(500).json({ error: "CSRF token not found" });

        const cookieHeader = cookies.map(c => c.split(";")[0]).join("; ");

        const loginRes = await fetch("https://lk.samgtu.ru/site/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Cookie": cookieHeader,
                "User-Agent": "Mozilla/5.0",
                "Referer": "https://lk.samgtu.ru/site/login"
            },
            body: new URLSearchParams({
                "_csrf": csrfToken,
                "LoginForm[username]": username,
                "LoginForm[password]": password,
                "LoginForm[rememberMe]": "1"
            })
        });

        const loggedInCookies = loginRes.headers.raw()["set-cookie"]
            .map(c => c.split(";")[0])
            .join("; ");

        const scheduleRes = await fetch("https://lk.samgtu.ru/api/common/distancelearning?start=2025-04-28T00:00:00+04:00&end=2025-06-09T00:00:00+04:00", {
            headers: {
                "Cookie": loggedInCookies,
                "User-Agent": "Mozilla/5.0",
                "Accept": "application/json"
            }
        });

        const schedule = await scheduleRes.json();
        res.json({ success: true, schedule });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Что-то пошло не так!" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});