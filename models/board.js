var mongoose = require('mongoose');
const { Task } = require('./task');
const boardSchema = new mongoose.Schema({
  title: String,
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'task'}]
});

module.exports.boardSchema = boardSchema;
module.exports.Board = mongoose.model('board', boardSchema);
