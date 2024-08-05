const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const newsSchema = new Schema({
    datetime: String,
    image: String,
    link: String,
    source: String,
    title: String,
    _id:String,
});

const bookmarkSchema = new Schema({
    userId: { type: String, required: true },
    news: [newsSchema] // Array of news objects
});

const Bookmark = mongoose.model('Bookmark', bookmarkSchema);

module.exports = Bookmark;
