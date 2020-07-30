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

router.delete("/deleteComment", function (req, res) {
  Comment.findOneAndDelete(req.body.comment, function (err, Comment) {
    console.log("DELETE removing ID: " + Comment);
  });
});

module.exports = router;
