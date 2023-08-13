const express = require("express");
const router = express.Router();
const axios = require("axios");
const uid2 = require("uid2");
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const isAuthenticated = require("../middleware/isAuthenticated");

const API_KEY = process.env.API_KEY_MARVEL;
// console.log(API_KEY);

const UserPerson = require("../models/UserPerson");
const FavoriteCharacter = require("../models/FavoriteCharacter");
const FavoriteComic = require("../models/FavoriteComics");

router.post("/users/signup", async (req, res) => {
  const { email, username, password } = req.body;
  // console.log(req.body);

  try {
    if (!password) {
      return res.status(400).json({ message: "Password is needed" });
    }

    const UserEmailReceived = await UserPerson.findOne({ email: email });
    // console.log(UserEmailReceived);
    if (UserEmailReceived !== null) {
      return res.status(409).json({ message: "This email is already used" });
    }

    const token = uid2(64);
    const salt = uid2(16);
    const hash = SHA256(password + salt).toString(encBase64);

    const newUser = new UserPerson({
      email: email,
      username: username,
      token: token,
      salt: salt,
      hash: hash,
    });

    // console.log(newUser);

    await newUser.save();

    res.json({
      _id: newUser._id,
      username: username,
      email: email,
      token: token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/users/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserPerson.findOne({ email: email });
    if (user === null) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    console.log(user);

    const newHash = SHA256(password + user.salt).toString(encBase64);
    // console.log(newHash);

    if (newHash !== user.hash) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    res.json({
      _id: user._id,
      email: user.email,
      username: user.username,
      token: user.token,
    });
  } catch (error) {}
});

router.get("/:id/favorites", isAuthenticated, async (req, res) => {
  console.log("cette route fonctionne");
  console.log(req.params.id);

  const allCharacterFav = await FavoriteCharacter.find({
    owner: req.params.id,
  });
  console.log("marvel---->", allCharacterFav);

  const allComicsFav = await FavoriteComic.find({
    owner: req.params.id,
  });
  console.log("comic---->", allComicsFav);

  res.json({ allCharacterFav, allComicsFav });
});

module.exports = router;
