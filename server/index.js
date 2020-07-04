const express = require("express");
const app = express();
const port = 5000;
const bodyParser = require("body-parser");
const { User } = require("./models/User");
const config = require("./config/key");
const cookieParser = require("cookie-parser");
const { auth } = require("./middleware/auth");

// application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// application/json
app.use(bodyParser.json());
// Use cookieParser to save token
app.use(cookieParser());

// MongoDB connect
const mongoose = require("mongoose");
mongoose
  .connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log("MongoDB connected!.."))
  .catch((err) => console.log(err)); // Check MongoDB Connection

app.get("/", (req, res) => res.send("Hello World!~~~~"));

app.get("/api/hello", (req, res) => {
  res.send("Testing Axios");
});

app.post("/api/users/register", (req, res) => {
  // When we get the information to sign up from client,
  // put them in the DB.
  const user = new User(req.body);

  // MongoDB Method to save userInfo
  user.save((err, userInfo) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({
      success: true,
    });
  });
});

// Login Router
app.post("/api/users/login", (req, res) => {
  // Verify that the requested email is in the DB
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user) {
      return res.json({
        loginSuccess: false,
        message: "There is no user using this email.",
      });
    }

    // Confirm password if requested email is in DB
    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch)
        return res.json({
          loginSuccess: false,
          message: "Incorrect password.",
        });

      // Then, generate token.
      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err);

        // Save token.
        res
          .cookie("x_auth", user.token)
          .status(200)
          .json({ loginSuccess: true, userID: user._id });
      });
    });
  });
});

// Authentication Router
app.get("/api/users/auth", auth, (req, res) => {
  // Passed middleware, Authentication is True.

  // Set role [0 = Users],
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image,
  });
});

app.get("/api/users/logout", auth, (req, res) => {
  // console.log('req.user', req.user)
  User.findOneAndUpdate({ _id: req.user._id }, { token: "" }, (err, user) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).send({
      success: true,
    });
  });
});

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
