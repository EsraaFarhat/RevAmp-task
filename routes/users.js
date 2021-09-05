const { User, validate } = require("../models/user");

const isAdmin = require("../middleware/isAdmin");
const auth = require("../middleware/auth");

const _ = require("lodash");
const bcrypt = require("bcrypt");
const express = require("express");

const router = express.Router();

// get all users on the system
router.get("/", [auth, isAdmin], async (req, res, next) => {
  const users = await User.find();
  res.send({ users });
});

// sign up
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

router.patch("/:id", [auth, isAdmin], async (req, res, next) => {
  let id = req.params.id;
  let updatedUser = await User.findById(id);

  if (req.body.email) {
    let user = await User.findOne({ email: req.body.email });
    if (user && user.email != updatedUser.email)
      return res
        .status(400)
        .send({ message: "Email is already in use. try another one." });
  }

  if (req.body.password) {
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);
  }

  user = await User.findByIdAndUpdate(
    id,
    _.pick(req.body, [
      "fname",
      "lname",
      "email",
      "password",
      "role",
    ]),
    {
      new: true,
      useFindAndModify: false,
    }
  );

  if (!user) return res.status(404).send({ message: "User not found" });

  res.send({
    user: _.pick(user, [
      "_id",
      "fname",
      "lname",
      "email",
      "role",
    ]),
  });
});

// delete user by id
router.delete("/:id", [auth, isAdmin], async (req, res, next) => {
  let id = req.params.id;

  const user = await User.findById(id);

  if (!user) return res.status(404).send({ message: "User not found" });

  await user.remove();

  res.send({message: "user has been deleted."});
});

// For My profile page
router.get("/me", auth, async (req, res, next) => {
  let id = req.user._id;
  const user = await User.findById(id);
  res.send({ user });
});

// to get any user
router.get("/:id", [auth, isAdmin], async (req, res, next) => {
  let id = req.params.id;
  const user = await User.findById(id);

  if (!user) return res.status(400).send({ message: "User not found!" });

  res.send({
    user: _.pick(user, [
      "_id",
      "fname",
      "lname",
      "email",
      "role",
    ]),
  });
});


module.exports = router;
