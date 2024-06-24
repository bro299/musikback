const express = require('express');
const ytdl = require('ytdl-core');
const cors = require('cors');
const app = express();

app.use(cors());

// Route untuk root URL
app.get('/', (req, res) => {
    res.send('Welcome to the YouTube Music Downloader API');
});

app.get('/download', async (req, res) => {
    const url = req.query.url;
    if (!url) {
        return res.status(400).json({ success: false, message: 'URL is required' });
    }

    try {
        const info = await ytdl.getInfo(url);
        const title = info.videoDetails.title;
        res.header('Content-Disposition', `attachment; filename="${title}.mp3"`);
        ytdl(url, {
            filter: 'audioonly',
            quality: 'highestaudio',
            format: 'mp3'
        }).pipe(res);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to download' });
    }
});

const PORT = process.env.PORT || 9999;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


