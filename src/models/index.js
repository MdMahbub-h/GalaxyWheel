const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.history = require("./History");
db.settings = require("./Settings");

module.exports = db;
