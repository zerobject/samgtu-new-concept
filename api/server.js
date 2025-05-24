// server.js
import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
app.use(cors());

app.get('/schedule', async (req, res) => {
    const { start, end } = req.query;
    const url = `https://lk.samgtu.ru/api/common/distancelearning?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`;

    const headers = {
        'User-Agent': 'Mozilla/5.0',
        'Referer': 'https://lk.samgtu.ru/distancelearning/distancelearning/index',
        // Добавь куки, если они необходимы
        // 'Cookie': 'identity=...; PHPSESSID=...'
    };

    try {
        const response = await fetch(url, { headers });
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка при получении данных' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});