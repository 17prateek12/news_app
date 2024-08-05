const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
    title: String,
    link: String,
    image: String,
    source: String,
    datetime: Date,
    time: String,
    articleType: String,
});

newsSchema.index({ title: 'text', content: 'text' });


module.exports =  mongoose.model('News', newsSchema);