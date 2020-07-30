const express = require("express");
const router = express.Router();
const { Favorite } = require("../models/Favorite");
const { auth } = require("../middleware/auth");

// Get number of favortie from DB
router.post("/favoriteNumber", (req, res) => {
  Favorite.find({ movieId: req.body.movieId }).exec((err, info) => {
    if (err) return res.status(400).send(err);

    res.status(200).json({ success: true, favoriteNumber: info.length });
  });
});

// Check User favorited specific movie or not.
router.post("/favorited", (req, res) => {
  Favorite.find({
    movieId: req.body.movieId,
    userFrom: req.body.userFrom,
  }).exec((err, info) => {
    if (err) return res.status(400).send(err);

    // If user didn't favorite
    let result = false;
    if (info.length !== 0) {
      result = true;
    }

    res.status(200).json({ success: true, favorited: result });
  });
});

// Remove from favorite
router.post("/removeFromFavorite", (req, res) => {
  Favorite.findOneAndDelete({
    movieId: req.body.movieId,
    userFrom: req.body.userFrom,
  }).exec((err, doc) => {
    if (err) return res.status(400).json({ success: false, err });
    return res.status(200).json({ success: true, doc });
  });
});

// Add to favorite
router.post("/addToFavorite", (req, res) => {
  const favorite = new Favorite(req.body);

  favorite.save((err, doc) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({ success: true, doc });
  });
});

// Get favorited Movie
router.post("/getFavoritedMovie", (req, res) => {
  Favorite.find({ userFrom: req.body.userFrom }).exec((err, favorites) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({ success: true, favorites });
  });
});

module.exports = router;
