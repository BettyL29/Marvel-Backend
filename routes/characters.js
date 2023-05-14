const express = require("express");
const router = express.Router();
const axios = require("axios");
const isAuthenticated = require("../middleware/isAuthenticated");
const FavoriteCharacter = require("../models/FavoriteCharacter");

const API_KEY = process.env.API_KEY_MARVEL;
// console.log(API_KEY);

router.get("/characters", async (req, res) => {
  // console.log(req.query);

  try {
    const { page, limit, name } = req.query;
    let skip = (page - 1) * limit;

    let filter = "";
    if (name) {
      filter = `limit=${limit}&name=${name}&skip=${skip}`;
    } else {
      filter = `limit=${limit}&skip=${skip}`;
    }

    console.log(filter);

    const response = await axios.get(
      `https://lereacteur-marvel-api.herokuapp.com/characters?apiKey=${API_KEY}&${filter}`
    );

    // &name=${req.body.name}&limit=${req.body.limit}&skip=${req.body.skip}`
    // console.log(API_KEY);
    // console.log(response);
    // console.log(response.data);
    res.status(200).json(response.data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post("/favorites/character", isAuthenticated, async (req, res) => {
  // console.log("cette route fonctionne");
  try {
    const { marvelId, name, description } = req.body;
    console.log(req.body);

    const newFavoriteCharacter = new FavoriteCharacter({
      marvelId: marvelId,
      name: name,
      description: description,
      owner: req.user,
    });

    // console.log(newFavoriteCharacter);
    await newFavoriteCharacter.save();
    res.status(200).json({
      marvelId: marvelId,
      name: name,
      description: description,
      owner: req.user,
    });
  } catch (error) {
    res.status(500).json(error.message);
  }
});

module.exports = router;
