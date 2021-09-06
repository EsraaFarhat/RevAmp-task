const express = require("express");
const cors = require("cors");

const admin = require("../routes/admin");
const error = require("../middleware/error");

module.exports = function (app) {
  app.use(express.json());
  app.use(cors());

  app.use("/admin", admin);

  app.use(error);
};
