const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  value: String,
  children: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Content'
  }],
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Content'
  },
  root: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Content'
  },
})

module.exports = mongoose.model('Content', userSchema);
