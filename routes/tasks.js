
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var assert = require('assert');

var { Board } = require('../models/board');
var { Task } = require('../models/task');

router.post('/', function (req, res, next) {
  const { task, boardId } = req.body,
        token = req.headers.authorization;

  Task.create(task)
    .then(task => {
      Board.findOneAndUpdate({ _id: boardId }, { $push: { tasks: task } })
        .then(board => res.send(task));
    })
    .catch(e => res.send(e));
});

router.put('/', function (req, res, next) {
  const task = req.body,
        token = req.headers.authorization;

  Task.updateOne({ _id: task._id }, task)
    .then(e => res.send(task))
    .catch(e => res.send(e));
});

router.delete('/', function (req, res, next) {
  const { boardId, id } = req.body,
        token = req.headers.authorization;

  if (token) {
    Task.findByIdAndRemove(id)
      .then(board => Board.findByIdAndUpdate(boardId, { $pullAll: { tasks: [ id ] } }))
      .then(e => res.send({ status: 'OK' }))
      .catch(e => res.send(e));
  }
});

router.post('/move', function (req, res, next) {
  const { destId, taskId, fromId } = req.body,
        token = req.headers.authorization;

  if (token) {
    Board.findByIdAndUpdate(destId, { $push: { tasks: taskId } })
      .then(board => Board.findByIdAndUpdate(fromId, { $pull: { tasks: taskId } }))
      .then(e => res.send({ status: 'OK' }))
      .catch(e => res.send(e));
  }
});



module.exports = router;
