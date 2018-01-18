var mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  login: String,
  password: String,
  token: String,
  boards: [{ type: mongoose.Schema.Types.ObjectId, ref: 'board'} ]
});

module.exports.userSchema = userSchema;
module.exports.User =  mongoose.model('user', userSchema);