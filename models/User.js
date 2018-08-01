const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  handle: String,
  email: String,
  email: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Blog'
  }],
})

module.exports = mongoose.model('User', userSchema);
