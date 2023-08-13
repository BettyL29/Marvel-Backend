const mongoose = require("mongoose");

const FavoriteComic = mongoose.model("FavoriteComic", {
  comicId: String,
  title: String,
  picture: String,
  description: String,
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
  },
});

module.exports = FavoriteComic;
