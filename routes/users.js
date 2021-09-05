const { User, validate } = require("../models/user");

const _ = require("lodash");
const bcrypt = require("bcrypt");
const express = require("express");

const router = express.Router();

//* sign up
router.post("/signUp", async (req, res, next) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send({message: error.details[0].message});

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send({message: "User already registered!"});

  user = new User(
    _.pick(req.body, ["fname", "lname", "email", "password", "role"])
  );

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  const token = user.generateAuthToken();

  await user.save();
  res.send({user: _.pick(user, ["_id", "fname", "lname", "email", "role"])});
});

module.exports = router;
