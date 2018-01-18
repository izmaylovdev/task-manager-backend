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
        res.send({ token: user.token, boards: user.boards });
      } else {
        res.status(400).send('User dont find!');
      }
    })
});

router.post('/signup', function(req, res, next) {
  var userData = req.body;
  User.findOne(userData)
    .then(user => {
      if (user) {
        res.status(400).send('User allredy exist!');
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

router.post('/logout', function(req, res, next) {
  const token = req.headers.authorization,
        newToken = jwt.sign(token, 'mysecretkey');

  User.update({ token }, { $set: { token: newToken } })
    .then(user => {
      res.send(true);
    })
    .catch(e => {
      res.status(400).send(e);
    })
});

module.exports = router;
