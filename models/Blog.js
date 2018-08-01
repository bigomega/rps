const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
  title: String,
  subTitle: String,
  tags: [String],
  content: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Content'
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
})

module.exports = mongoose.model('Blog', blogSchema);
