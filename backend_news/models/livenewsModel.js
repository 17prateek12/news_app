const mongoose = require('mongoose');

const livenewsSchema = new mongoose.Schema({
    title: String,
    link: String,
    image: String,
    source: String,
    datetime: Date,
    time: String,
    articleType: String,
});

livenewsSchema.index({ title: 'text', content: 'text' });


module.exports = mongoose.model('LiveNews', livenewsSchema);