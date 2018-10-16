const mongoose = require('mongoose');
const keys = require('../../config/config');
const mongoKey = keys.mongoDB.dburi;

mongoose.connect(mongoKey, console.log('connected to database'));

const userSchema = mongoose.Schema({
  userID: String,
  userName: String,
  routePreference: String,
  Home: String
});



let User = mongoose.model('User', userSchema);

module.exports = User;
