const express = require("express");
const router = express.Router();
const { Comment } = require("../models/Comment");
const { auth } = require("../middleware/auth");

router.post("/saveComment", auth, (req, res) => {
  const comment = new Comment(req.body);

  comment.save((err, comment) => {
    console.log(err);
    if (err) return res.json({ success: false, err });

    Comment.find({ _id: comment._id })
      .populate("writer")
      .exec((err, result) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).json({ success: true, result });
      });
  });
});

router.post("/getComments", (req, res) => {
  Comment.find({ postId: req.body.movieId })
    .populate("writer")
    .exec((err, comments) => {
      if (err) return res.status(400).send(err);
      res.status(200).json({ success: true, comments });
    });
});

// writer: {
//   type: Schema.Types.ObjectId,
//   ref: "User",
// },
// postId: {
//   type: String,
// },
// responseTo: {
//   type: Schema.Types.ObjectId,
//   ref: "User",
// },
// content: {
//   type: String,
// },

router.post("/removeComment", (req, res) => {
  Comment.findOneAndDelete({
    writer: req.body.writer,
    postId: req.body.postId,
    responseTo: req.body.responseTo,
    content: req.body.content,
  }).exec((err, doc) => {
    if (err) return res.status(400).json({ success: false, err });
    return res.status(200).json({ success: true, doc });
  });
});

// router.post("/removeFromFavorite", (req, res) => {
//   Favorite.findOneAndDelete({
//     movieId: req.body.movieId,
//     userFrom: req.body.userFrom,
//   }).exec((err, doc) => {
//     if (err) return res.status(400).json({ success: false, err });
//     return res.status(200).json({ success: true, doc });
//   });
// });

module.exports = router;
