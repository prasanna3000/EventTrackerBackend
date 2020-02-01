const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const PORT = 8679;

let Todo = require('./todo.model');
app.use(cors());
app.use('/*', function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'DELETE,GET,PATCH,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  next();
});
app.use(bodyParser.json());

mongoose.connect('mongodb://127.0.0.1:27017/todos', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const connection = mongoose.connection;

connection.once('open', function() {
  console.log('MongoDB database connection established successfully');
});
mongoose.set('useFindAndModify', false);

app.get('/posts', async function(req, res) {
  try {
    let itemtoFind = await Todo.find({});
    res.status(200).json(itemtoFind);
    return;
  } catch (err) {
    if (err) {
      console.log(err);
      res.status(500);
      return;
    }
  }
});

app.delete('/delete/:_id', async function(req, res, next) {
  // res.set({
  //   'Access-Control-Allow-Origin': '*',
  //   'Access-Control-Allow-Methods': 'DELETE,GET,PATCH,POST,PUT',
  //   'Access-Control-Allow-Headers': 'Content-Type,Authorization'
  // });
  var query = { _id: req.params._id };
  try {
    let itemToremove = await Todo.remove(query);
    res.set('Content-Type', 'application/json');
    res.status(200).json(itemToremove);
    return;
  } catch (err) {
    if (err) {
      console.log(err);
      res.status(500);
      return;
    }
  }
});

app.post('/add', async function(req, res) {
  // res.json(req.body);
  var post = req.body;
  try {
    let eventToadd = await Todo.insertMany(post);
    // console.log('=====>', eventToadd);
    eventToadd = eventToadd.map(k => k.toJSON());
    res.status(200).json(eventToadd);
    return;
  } catch (err) {
    if (err) {
      console.log(err);
      res.status(500);
      return;
    }
  }
});

app.put('/update/:_id', async function(req, res, next) {
  // res.set({
  //   'Access-Control-Allow-Origin': '*',
  //   'Access-Control-Allow-Methods': 'DELETE,GET,PATCH,POST,PUT',
  //   'Access-Control-Allow-Headers': 'Content-Type,Authorization'
  // });
  var post = req.body;
  var query = { _id: req.params._id };
  var update = {
    $set: {
      event_date: post.event_date,
      event_time: post.event_time,
      description: post.description,
      attendies: post.attendies
    }
  };
  var options = { new: true };

  try {
    const updatedResult = await Todo.findByIdAndUpdate(query, update, options);
    res.set('Content-Type', 'application/json');
    res.status(200).json(updatedResult);
    return;
  } catch (error) {
    console.log(error);
    res.status(500);
    return;
  }
});
app.listen(PORT, function() {
  console.log('Server is running on Port:' + PORT);
});
