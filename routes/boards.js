var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient,
    assert = require('assert');

/* GET boards listing. */
const arr = [
  {
    id: 0,
    name: 'Waiting',
    tasks: [
      { id: 0, text: 'Sign in' },
      { id: 1, text: 'Create first task' },
    ]
  },
  {
    id: 1,
    name: 'In Work',
    tasks: []
  }
];

router.get('/', function (req, res, next) {
  var url = 'mongodb://localhost:27017';

  // Use connect method to connect to the server
  MongoClient.connect(url, function (err, client) {
    assert.equal(null, err);

    const db = client.db('taskManager');

    const boards = db.collection('users').find({}).boards;

    res.json(boards);
    next();

    client.close();
  });
  
});

router.post('/', function (req, res, next) {
  var url = 'mongodb://localhost:27017/taskManager';

  // Use connect method to connect to the server
  MongoClient.connect(url, function (err, client) {
    assert.equal(null, err);

    // var collection = db.collection('documents');
    arr.push(req.body);
    console.log(req.body);
    res.json(arr);
    next();

    db.close();
  });
  
});

module.exports = router;
