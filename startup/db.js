const mongoose = require("mongoose");

require('dotenv').config()

module.exports = function () {
  mongoose
    .connect(process.env.CONNECTION_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("connected to MongoDB..."));
};
