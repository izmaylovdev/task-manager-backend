var mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  dueDate: Date
});

module.exports.taskSchema = taskSchema
module.exports.Task = mongoose.model('task',taskSchema);
