const mongoose = require("mongoose");

const UserPerson = mongoose.model("User", {
  email: String,
  username: String,
  token: String,
  hash: String,
  salt: String,
});

module.exports = UserPerson;
