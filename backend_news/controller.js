const News = require("./models/newsModel.js");
const asyncHandler = require("express-async-handler");
const googleNewsScraper = require("google-news-scraper");
const axios = require('axios');
const LiveNews = require("./models/livenewsModel.js");
const cheerio = require('cheerio'); // Import cheerio using CommonJS
const ShowCaseNews = require("./models/showcaseModel.js");

const scrapeAndSaveNews = asyncHandler(async (searchTerm) => {
    try {
        const news = await googleNewsScraper({
            searchTerm: searchTerm,
            prettyURLs: false,
            timeframe: '7d',
        });

        console.log(`Fetched ${news.length} articles for '${searchTerm}'`);

        // Proxy images to be accessible
        const proxiedNews = await Promise.allSettled(news.map(async (article) => {
            if (article.image) {
                try {
                    const imageResponse = await axios.get(article.image, { responseType: 'arraybuffer' });
                    const imageBuffer = Buffer.from(imageResponse.data, 'binary').toString('base64');
                    article.image = `data:${imageResponse.headers['content-type']};base64,${imageBuffer}`;
                } catch (error) {
                    console.error('Error fetching image:', error);
                }
            }
            return article;
        }));

        // Filter out rejected promises
        const fulfilledNews = proxiedNews.filter(result => result.status === 'fulfilled').map(result => result.value);

        // Log all links for debugging
        fulfilledNews.forEach(article => {
            console.log(`Article link: ${article.link}`);
        });

        // Remove old data for the specific type
        await News.deleteMany({ articleType: searchTerm });

        // Prepare bulk write operations
        const bulkOps = fulfilledNews.map(article => ({
            updateOne: {
                filter: { image: article.image },
                update: { $set: { ...article, articleType: searchTerm } },
                upsert: true,
            },
        }));

        // Execute bulk write
        const bulkWriteResult = await News.bulkWrite(bulkOps);
        console.log(`Bulk write result: ${JSON.stringify(bulkWriteResult, null, 2)}`);
        console.log(`Saved ${fulfilledNews.length} news items for '${searchTerm}'`);
    } catch (error) {
        console.error(`Error fetching news for '${searchTerm}':`, error);
    }
});

const scrapeAndSaveLiveNews = asyncHandler(async (searchTerm) => {
    try {
        const news = await googleNewsScraper({
            searchTerm: searchTerm,
            prettyURLs: false,
            timeframe: '1d',
        });

        console.log(`Fetched ${news.length} articles for '${searchTerm}'`);

        // Proxy images to be accessible
        const proxiedNews = await Promise.allSettled(news.map(async (article) => {
            if (article.image) {
                try {
                    const imageResponse = await axios.get(article.image, { responseType: 'arraybuffer' });
                    const imageBuffer = Buffer.from(imageResponse.data, 'binary').toString('base64');
                    article.image = `data:${imageResponse.headers['content-type']};base64,${imageBuffer}`;
                } catch (error) {
                    console.error('Error fetching image:', error);
                }
            }
            return article;
        }));

        // Filter out rejected promises
        const fulfilledNews = proxiedNews.filter(result => result.status === 'fulfilled').map(result => result.value);

        // Log all links for debugging
        fulfilledNews.forEach(article => {
            console.log(`Article link: ${article.link}`);
        });

        // Remove old data for the specific type
        await LiveNews.deleteMany({ articleType: searchTerm });

        // Prepare bulk write operations
        const bulkOps = fulfilledNews.map(article => ({
            updateOne: {
                filter: { image:article.image },
                update: { $set: { ...article, articleType: searchTerm } },
                upsert: true,
            },
        }));

        // Execute bulk write
        const bulkWriteResult = await LiveNews.bulkWrite(bulkOps);
        console.log(`Bulk write result: ${JSON.stringify(bulkWriteResult, null, 2)}`);
        console.log(`Saved ${fulfilledNews.length} live news items for '${searchTerm}'`);
    } catch (error) {
        console.error(`Error fetching live news for '${searchTerm}':`, error);
    }
});




async function googlenews(url) {
    try {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);

        const images = [];
        $('img.UiDffd.b1F67d').each((index, element) => {
            const imageLink = $(element).attr('src');
            images.push(imageLink);
        });

        const headings = [];
        $('.MyQDIb').each((index, element) => {
            const resname = $(element).text().trim();
            headings.push(resname);
        });

        const showdatas = [];
        $('.DmUJ4').each((index, element) => {
            const imageUrl = $(element).find('img.TMIk5d').attr('src');
            const showcaseText = $(element).find('div.xm2Fjf').text().trim();
            const datetime = $(element).find('time.xsHp8').attr('datetime');

            if (imageUrl && showcaseText && datetime) {
                showdatas.push({
                    imageUrl,
                    showcaseText,
                    datetime
                });
            }
        });

        const newsdata = [];
        $('.wwh0Hb').each((index, parentContainer) => {
            const titles = [];
            const titleslink = [];
            const sources = [];

            $(parentContainer).find('a.kEAYTc.r5Cqre').each((i, element) => {
                const title = $(element).text().trim();
                const titleLink = $(element).attr('href');
                if (title) {
                    titles.push(title);
                }
                if (titleLink) {
                    titleslink.push('https://news.google.com' + titleLink);
                }
            });

            $(parentContainer).find('div.JrYg1b.vP0hTc').each((i, element) => {
                const source = $(element).text().trim();
                if (source) {
                    sources.push(source);
                }
            });

            const innercards = [];
            for (let i = 0; i < titles.length; i++) {
                innercards.push({
                    title: titles[i],
                    titlelink: titleslink[i],
                    source: sources[i],
                });
            }

            newsdata.push({
                heading: headings[index] || "",
                image: images[index] || "",
                showdata: showdatas[index] || [],
                innercards: innercards || []
            });
        });

        // Clear existing data before upserting
        await ShowCaseNews.deleteMany({});

        // Perform bulk write
        const bulkOps = newsdata.map((news) => ({
            updateOne: {
                filter: { 'innercards.titlelink': { $in: news.innercards.map(card => card.titlelink) } },
                update: { $set: news },
                upsert: true,
            }
        }));

        const result = await ShowCaseNews.bulkWrite(bulkOps);
        console.log('Saved news data:', result);

        return { newsdata };

    } catch (error) {
        console.error("Failed to fetch data from URL:", url, error);
        return { newsdata: [] };
    }
}


module.exports = {
    scrapeAndSaveNews,
    scrapeAndSaveLiveNews,
    googlenews
};