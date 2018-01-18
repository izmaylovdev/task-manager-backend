var express = require('express');
var debug = require('debug')('http');
var router = express.Router();
var { User } = require('../models/user');
var jwt = require('jsonwebtoken');

/* GET users listing. */
router.post('/signin', function(req, res, next) {
  var userData = req.body;
  User.findOne(userData)
    .populate({
      path: 'boards',
      populate: {
        path: 'tasks'
      }
    })
    .then(user => {
      if (user) {
        res.json({ token: user.token, boards: user.boards });
      } else {
        User.findOne({ login: userData.login })
          .then(user => {
            if (user) {
              res.status(400).json({ message: 'Wrong password!' });
            } else {
              res.status(400).json({ message: 'User dont find!' });
            }
          })
      }
    })
});

router.post('/signup', function(req, res, next) {
  var userData = req.body;
  User.findOne({ login: userData.login })
    .then(user => {
      if (user) {
        res.status(400).json({ message: 'User already exist!' });
      } else if(userData.login && userData.password){
        var token = jwt.sign(userData, 'mysecretkey');
        var userObj = Object.assign(
          userData,
          {
            token: token,
            boards: [
              {
                title: 'To do',
                tasks: []
              }
            ]
          }
        );

        User.create(userObj, () => {
          res.send({ token, boards: userObj.boards });
        });
      }
    })
    .catch(e => {
    })
});

module.exports = router;
