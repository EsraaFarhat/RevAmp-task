const { User } = require("../models/user");

const bcrypt = require("bcrypt");
const Joi = require("joi");
const _ = require("lodash");
const express = require("express");

const router = express.Router();

router.post("/login", async (req, res, next) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send({message: error.details[0].message});

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send({message: "Invalid email or password!"});

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send({message: "Invalid email or password!"});

  const token = user.generateAuthToken();

  res.json({
    api_token: token,
    user: _.pick(user, [
        "_id",
        "fname",
        "lname",
        "email",
        "role",
      ]),
  });
});

function validate(req) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
  });
  return schema.validate(req);
}

module.exports = router;