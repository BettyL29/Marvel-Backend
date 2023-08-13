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

    // console.log(filter);

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
  const { marvelId, name, description, picture } = req.body;
  try {
    // const { marvelId, name, description, token } = req.body;
    console.log(req.body);

    const newFavoriteCharacter = new FavoriteCharacter({
      marvelId: marvelId,
      name: name,
      description: description,
      picture: picture,
      owner: req.user,
    });

    console.log(newFavoriteCharacter);
    await newFavoriteCharacter.save();
    res.status(200).json({
      marvelId: marvelId,
      name: name,
      description: description,
      picture: picture,
      owner: req.user,
    });
  } catch (error) {
    res.status(500).json(error.message);
  }
});

router.delete(
  "/favorites/character/delete",
  isAuthenticated,
  async (req, res) => {
    const { marvelId } = req.body;
    console.log(marvelId);
    try {
      const marvelToDelete = await FavoriteCharacter.findOneAndDelete({
        marvelId: marvelId,
      });
      console.log(marvelToDelete);

      if (marvelToDelete) {
        res.status(200).json({ message: "Favori supprimé avec succès." });
      } else {
        res.status(404).json({ message: "Favori non trouvé." });
      }
    } catch (error) {
      res.status(500).json(error.message);
    }
  }
);

module.exports = router;
