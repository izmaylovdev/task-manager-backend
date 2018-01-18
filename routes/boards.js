
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var assert = require('assert');

var { User } = require('../models/user');
var { Board } = require('../models/board');
var { Task } = require('../models/task');

/* GET boards listing. */

router.get('/', function (req, res, next) {
  const token = req.headers.authorization;
  if (!token) {
    res.send([{
      title: 'To do',
      tasks: [
        {
          title: 'Login',
          description: 'Sign up or sign in to this app',
          dueDate: null
        }
      ]
    }]);
  } else {
    User
      .findOne({ token: token })
      .populate({ 
        path: 'boards',
        populate: {
          path: 'tasks'
        }
      })
      .then(user => {
        res.json(user.boards);
      })
      .catch(e => {
        res.status(403).send(e);
      })
  }

});

router.post('/', function (req, res, next) {
  const boardObj = req.body;
        token = req.headers.authorization;
  
  Board.create(boardObj)
    .then(board => {
      User.findOneAndUpdate({ token }, { $push: { boards: board } })
        .then(user => res.send(board));
    })
    .catch(e => res.json(e));
});

router.patch('/', function (req, res, next) {
  const { id, title } = req.body;
        token = req.headers.authorization;
  
  Board.findOneAndUpdate({ _id: id }, { $set: { title }})
    .then(e => res.json({ title }))
    .catch(e => res.json(e));
});

router.delete('/', function (req, res, next) {
  const { id } = req.body;
        token = req.headers.authorization;
  
  Board.findByIdAndRemove(id)
    .then(board => Task.remove({ _id: { $in: board.tasks } }))
    .then(e => res.json({ status: 'OK' }))
    .catch(e => res.status(400).json(e));
});

module.exports = router;
