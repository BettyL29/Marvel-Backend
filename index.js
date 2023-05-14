const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();

app.use(express.json());
app.use(cors());
require("dotenv").config();

mongoose.connect(process.env.MONGODB_URI);
console.log(process.env.MONGODB_URI);

const charactersRoute = require("./routes/characters");
const comicsRoute = require("./routes/comics");
const usersRoute = require("./routes/users");
app.use(charactersRoute);
app.use(comicsRoute);
app.use(usersRoute);

app.all("*", (req, res) => {
  res.status(404).json({ message: "404 - Page Not Found" });
});

app.listen(process.env.PORT, () => {
  console.log("Server started");
});
