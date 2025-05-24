import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
app.use(cors());

app.get('/schedule', async (req, res) => {
    const { start, end } = req.query;
    const url = `https://lk.samgtu.ru/api/common/distancelearning?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`;

    const headers = {
        'Host': 'lk.samgtu.ru',
        'Referer': 'https://lk.samgtu.ru/distancelearning/distancelearning/index',
        'Cookie': '_ym_uid=1742208173982713657; _ym_d=1742208173; tmr_lvid=294e82ae3092bed18829788ce50f484f; tmr_lvidTS=1742209829667; _ym_isad=2; _csrf=dc3cf43085204078e1c511097ea4dfb54b1172cfec3902475fb040334103db95a%3A2%3A%7Bi%3A0%3Bs%3A5%3A%22_csrf%22%3Bi%3A1%3Bs%3A32%3A%228CfIzSt73w5NdvDtCCu-lm1RYcUcHlRJ%22%3B%7D; PHPSESSID=tdf8456qe1ndn6bvuhdghcmm1p; _identity=4c49b207682bcd0dcdaf8a8f66d47cd7198a7fcddbf1af0e7d2b3bd0a87aeecca%3A2%3A%7Bi%3A0%3Bs%3A9%3A%22_identity%22%3Bi%3A1%3Bs%3A21%3A%22%5B217118%2Cnull%2C2592000%5D%22%3B%7Dk',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36',
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