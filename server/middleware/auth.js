const { User } = require("../models/User");

let auth = (req, res, next) => {
  // Authentication

  // Brings toek nfrom Client's token.
  let token = req.cookies.w_auth;

  // Encrypt toekn, find user.
  User.findByToken(token, (err, user) => {
    if (err) throw err;
    if (!user) return res.json({ isAuth: false, error: true });

    // If user exists.
    req.token = token;
    req.user = user;
    next();
  });

  // Auth Ok, if there is user.

  // Auth No, if there is no user.
};

module.exports = { auth };
