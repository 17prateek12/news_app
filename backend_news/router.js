const express = require('express');
const asyncHandler = require('express-async-handler');
const cron = require('node-cron');
const News = require('./models/newsModel');
const LiveNews = require('./models/livenewsModel');
const ShowCaseNews = require('./models/showcaseModel');
const { scrapeAndSaveNews, scrapeAndSaveLiveNews, googlenews } = require('./controller');
const { getSocket } = require('./utils/socket');
const Bookmark = require('./models/bookmarkModal.js');




const router = express.Router();

const categories = [
    'education',
    'sports',
    'market',
    'economy',
    'technology',
    'india',
    'entertainment',
    'science',
    'health',
    'government',
    'world',
    'business',
    'climate',
    'ani',
    'politics',
    'finance',
    'startup',
    'food',
    'travel',
    'gaming',
    'real estate',
    'lifestyle',
    'crime',
    'automotive',
    'fashion',
    'culture'
];

const latestnews = [
    'live',
]

//--------------------------------------Collection 1 NEWS Model-----------------------------------------------------------//

//Save News Category wise
router.route('/scrape/:category').get(asyncHandler(async (req, res) => {
    const { category } = req.params;
    try {
        await scrapeAndSaveNews(category);
        res.send(`Successfully scraped and saved news for '${category}'`);
    } catch (error) {
        console.error(`Error scraping and saving news for '${category}':`, error);
        res.status(500).send(`Error scraping and saving news for '${category}'`);
    }
}));

// Endpoint to fetch news by category
router.route('/news/:category').get(asyncHandler(async (req, res) => {
    const { category } = req.params;
    const { page = 1, limit = 16 } = req.query;
    try {
        const news = await News.find({ articleType: category })
            .sort({ datetime: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .exec();

        const totalItems = await News.countDocuments({ articleType: category });
        const totalPages = Math.ceil(totalItems / limit);

        res.json({ page, limit, totalItems, totalPages, data: news });
    } catch (error) {
        res.status(500).send(`Error fetching news for '${category}'`);
    }
}));


router.route('/news').get(asyncHandler(async (req, res) => {
    const { page = 1, limit = 30 } = req.query;
    const pageNumber = parseInt(page, 10);
    const pageSize = parseInt(limit, 10);
    try {
        const news = await News.find()
            .sort({ datetime: -1 })
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .exec();

        const totalItems = await News.countDocuments();
        const totalPages = Math.ceil(totalItems / pageSize);

        res.json({
            page: pageNumber,
            pageSize,
            totalItems,
            totalPages,
            data: news
        });
    } catch (error) {
        console.error(`Error fetching news:`, error);
        res.status(500).send('Error fetching news');
    }
}));


// Schedule cron job to update news data
cron.schedule('00 */12 * * *', asyncHandler(async () => {
    console.log('Running cron job to update news data...');
    const io = getSocket();  // Get the global socket instance
    try {
        for (const category of categories) {
            await scrapeAndSaveNews(category);
            const news = await News.find({ articleType: category }).sort({ datetime: -1 }).exec();
            console.log(`Successfully updated news for '${category}'`);
            io.emit('news-update', { category, message: `News updated for '${category}'`, data: news });
        }
    } catch (error) {
        console.error(`Error updating news data:`, error);
    }
}));



//router.route('/delete-news/:category').delete(asyncHandler(async (req, res) => {
//    const { category } = req.params;
//    try {
//        // Delete all news items matching the category
//        const result = await LiveNews.deleteMany({ articleType: category });
//
//        if (result.deletedCount > 0) {
//            res.send(`Successfully deleted ${result.deletedCount} news items for '${category}'`);
//        } else {
//            res.send(`No news items found for '${category}'`);
//        }
//    } catch (error) {
//        console.error(`Error deleting news items for '${category}':`, error);
//        res.status(500).send(`Error deleting news items for '${category}'`);
//    }
//}));


//--------------------------------------Collection 2 LIVE NEWS Model-----------------------------------------------------------//

//scrape live news
router.route('/livenews/:category').get(asyncHandler(async (req, res) => {
    const { category } = req.params;
    try {
        await scrapeAndSaveLiveNews(category);
        res.send(`Successfully scraped and saved news for '${category}'`);
    } catch (error) {
        console.error(`Error scraping and saving news for '${category}':`, error);
        res.status(500).send(`Error scraping and saving news for '${category}'`);
    }
}));


//fetch live news
router.route('/fetch-livenews').get(asyncHandler(async (req, res) => {
    const { page = 1, limit = 16 } = req.query;
    try {
        const news = await LiveNews.find().sort({ datetime: -1 }).exec();
        // const io = getSocket();  // Get the global socket instance
        //io.emit('news-update', { message: `Fetched live news`,data: news });
        res.json(news);
    } catch (error) {
        console.error(`Error fetching live news:`, error);
        res.status(500).send('Error fetching live news');
    }
}));

//update live news
cron.schedule('00 */2 * * *', asyncHandler(async () => {
    console.log('Running cron job to update live news data...');
    const io = getSocket();  // Get the global socket instance
    try {
        for (const latest of latestnews) {
            await scrapeAndSaveLiveNews(latest);
            const news = await LiveNews.find().sort({ datetime: -1 }).exec();
            console.log(`Successfully updated news for '${latest}'`);
            io.emit('livenews-update', { message: `News updated for '${latest}'`, data: news });
        }
    } catch (error) {
        console.error(`Error updating news data for '${latest}':`, error);
    }

}));



//--------------------------------------Collection 3 SHOWCASE NEWS Model-----------------------------------------------------------//

const url = "https://news.google.com/showcase";

//scrape showcase news
router.route('/showcasenews').get(asyncHandler(async (req, res) => {
    try {
        const { newsdata } = await googlenews(url);
        res.json(newsdata);
    } catch (error) {
        console.error("Error fetching news:", error);
        res.status(500).json({ error: "Failed to fetch news" });
    }
}));


//fetch showcasenews
router.route('/db-mongo').get(asyncHandler(async (req, res) => {
    try {
        const news = await ShowCaseNews.find()
            .sort({ datetime: -1 })
            .exec();

        res.json({
            message: 'Connection successful',
            news
          
        });
    } catch (error) {
        console.error("Error fetching news from MongoDB:", error);
        res.status(500).json({ error: "Failed to fetch news from MongoDB" });
    }
}));


//update show case news
cron.schedule('0 */4 * * *', asyncHandler(async () => {
    console.log('Running cron job to update news data...');
    const io = getSocket();
    try {
        const news = await googlenews(url);
        console.log('Successfully updated news data');
        io.emit('shownews-update', { message: `update showcase news`, data: news });
    } catch (error) {
        console.error('Error updating news data:', error);
    }
}));


//--------------------------------------Global Search-----------------------------------------------------------//
router.route('/search-all').get(asyncHandler(async (req, res) => {
    const searchTerm = req.query.q;

    if (!searchTerm) {
        return res.status(400).json({ error: 'Missing search term' });
    }

    try {
        const newsResults = await News.find({
            $text: {
                $search: searchTerm
            }
        }).exec();

        const liveNewsResults = await LiveNews.find({
            $text: {
                $search: searchTerm
            }
        }).exec();

        const showCaseNewsResults = await ShowCaseNews.aggregate([
            { $unwind: "$innercards" }, // Unwind the innercards array
            {
                $match: {
                    $or: [
                        { 'innercards.title': { $regex: searchTerm, $options: 'i' } }, // Case-insensitive search
                        { 'heading': { $regex: searchTerm, $options: 'i' } } // Optionally search heading as well
                    ]
                }
            },
            {
                $group: {
                    _id: "$_id",
                    heading: { $first: "$heading" },
                    image: { $first: "$image" },
                    showdata: { $first: "$showdata" },
                    innercards: { $push: "$innercards" } // Collect all innercards
                }
            }
        ]).exec();

        const combinedResults = [
            ...newsResults,
            ...liveNewsResults,
            ...showCaseNewsResults
        ];

        res.json(combinedResults);
    } catch (error) {
        console.error('Error searching news across all models:', error);
        res.status(500).json({ error: 'Error searching news across all models' });
    }
}));




module.exports = router