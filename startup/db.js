const mongoose = require("mongoose");
const winston = require("winston");

require('dotenv').config();

module.exports = function () {
  mongoose
    .connect(process.env.CONNECTION_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => winston.info("connected to MongoDB..."));
};
