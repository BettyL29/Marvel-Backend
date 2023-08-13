const express = require("express");
const router = express.Router();
const axios = require("axios");
const isAuthenticated = require("../middleware/isAuthenticated");

const API_KEY = process.env.API_KEY_MARVEL;

const FavoriteComic = require("../models/FavoriteComics");

router.get("/comics", async (req, res) => {
  const { page, limit, title } = req.query;
  let skip = (page - 1) * limit;
  try {
    let filter = "";
    if (title) {
      filter = `limit=${limit}&title=${title}&skip=${skip}`;
    } else {
      filter = `limit=${limit}&skip=${skip}`;
    }

    // console.log(filter);

    const response = await axios.get(
      `https://lereacteur-marvel-api.herokuapp.com/comics?apiKey=${API_KEY}&${filter}`
    );
    // console.log(API_KEY);
    // console.log(response);
    // console.log(response.data);
    res.status(200).json(response.data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/comics/:characterId", async (req, res) => {
  try {
    // console.log(req.params);
    const { characterId } = req.params;

    const response = await axios.get(
      `https://lereacteur-marvel-api.herokuapp.com/comics/${characterId}?apiKey=${API_KEY}`
    );
    // console.log(response.data);
    res.status(200).json(response.data);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
});

router.post("/favorites/comic", isAuthenticated, async (req, res) => {
  // console.log("cette route fonctionne");
  try {
    const { comicId, title, description, picture } = req.body;
    // console.log(req.body);

    const newFavoriteComic = new FavoriteComic({
      comicId: comicId,
      title: title,
      description: description,
      picture: picture,
      owner: req.user,
    });

    await newFavoriteComic.save();
    res.status(200).json({
      comicId: comicId,
      title: title,
      description: description,
      picture: picture,
      owner: req.user,
    });
  } catch (error) {
    res.status(500).json(error.message);
  }
});

module.exports = router;
