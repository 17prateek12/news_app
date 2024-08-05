const express = require('express');
const asyncHandler = require('express-async-handler');
const Bookmark = require('./models/bookmarkModal.js');

const router = express.Router();

router.use((req, res, next) => {
   // console.log(`${req.method} ${req.url}`);
    //console.log('Headers:', req.headers);
//console.log('Body:', req.body);
    next();
});


router.post('/bookmark', async (req, res) => {
    const { userId, news } = req.body;
   // console.log("Request body", req.body);
   // console.log("news", news);

    if (!news) {
        return res.status(400).json({ message: 'News data is required' });
    }

    if (!userId) {
        return res.status(400).json({ message: 'userId data is required' });
    }

    try {
        let bookmark = await Bookmark.findOne({ userId });

        if (!bookmark) {
            bookmark = new Bookmark({ userId, news: [news] });
        } else {
            const newsExists = bookmark.news.some(item => item._id === news._id);
            if (!newsExists) {
                bookmark.news.push(news);
            }
        }

        await bookmark.save();
        res.status(200).json(bookmark);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'An error occurred', error: error.message });
    }
});



router.delete('/bookmark', async (req, res) => {
    const { userId, newsId } = req.body;

    try {
        // Find the bookmark document by userId
        const bookmark = await Bookmark.findOne({ userId });

        if (!bookmark) {
            return res.status(404).json({ message: 'Bookmark not found' });
        }

        // Filter out the news item to be removed
        bookmark.news = bookmark.news.filter(news => news._id !== newsId);

        // Save the updated bookmark document
        await bookmark.save();

        // Return the updated bookmark document
        res.status(200).json(bookmark);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


router.get('/bookmark/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const bookmark = await Bookmark.findOne({ userId: userId }).populate('news') // Populate news details

        if (!bookmark) {
            return res.status(404).json({ message: 'No bookmarks found' });
        }

        res.status(200).json(bookmark.news);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


module.exports = router;