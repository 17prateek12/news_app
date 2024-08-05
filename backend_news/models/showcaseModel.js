const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const InnerCardSchema = new Schema({
  title: String,
  titlelink: String,
  titleimage: String,
  source: String
});

const ShowDataSchema = new Schema({
  imageUrl: String,
  showcaseText: String,
  datetime: Date
});

const NewsSchema = new Schema({
  heading: String,
  image: String,
  showdata: [ShowDataSchema],
  innercards: [InnerCardSchema]
});

// Adding a text index on the 'innercards.title' field
NewsSchema.index({ 'innercards.title': 'text' });
NewsSchema.index({ heading: 1 }); // Index on 'heading'

module.exports =  mongoose.model('ShowCaseNews', NewsSchema);
