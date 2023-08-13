const UserPerson = require("../models/UserPerson");

const isAuthenticated = async (req, res, next) => {
  // console.log(req.headers.authorization);
  try {
    if (!req.headers.authorization) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const token = req.headers.authorization.replace("Bearer ", "");
    // console.log(token);

    const user = await UserPerson.findOne({ token: token }).select("_id");

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.user = user;
    // console.log(user);
    next();
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = isAuthenticated;
