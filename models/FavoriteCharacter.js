const mongoose = require("mongoose");

const FavoriteCharacter = mongoose.model("FavoriteCharacter", {
  marvelId: String,
  name: String,
  picture: String,
  description: String,
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
  },
});

module.exports = FavoriteCharacter;
