const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Todo = new Schema({
  event_date: {
    type: String
  },
  event_time: {
    type: String
  },
  description: {
    type: String
  },
  attendies: {
    type: String
  },
  editing: {
    type: Boolean
  }
});

module.exports = mongoose.model('Todo', Todo);
