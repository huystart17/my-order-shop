'use strict';

// user-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  facebookId: {type: String},
  facebook: {type: Schema.Types.Mixed},
  googleId: {type: String},
  google: {type: Schema.Types.Mixed},

  account: {type: String, required: true, unique: true},
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true},


  userRole: {type: String, default: 'customer'},// admin, employee, customer
  address: {type: Schema.Types.Mixed, required: true},
  phone: {type: String, required: true},


  createdAt: {type: Date, 'default': Date.now},
  updatedAt: {type: Date, 'default': Date.now}
});

const userModel = mongoose.model('user', userSchema);

module.exports = userModel;

/*
 account: "",
 email: "",
 password: "",

 phone: "",
 address: {
 city: "",
 province: "",
 other: ""
 }
 * */
