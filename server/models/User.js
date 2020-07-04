const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
// The numebr of letters to encrypt
const saltRounds = 10;
const jwt = require("jsonwebtoken");

// User schema
const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 50,
  },
  email: {
    type: String,
    trim: true,
    unique: 1,
  },
  password: {
    type: String,
    minlength: 5,
  },
  lastname: {
    type: String,
    maxlength: 50,
  },
  role: {
    type: Number,
    default: 0,
  },
  image: String,
  token: {
    type: String,
  },
  tokenExp: {
    type: Number,
  },
});

userSchema.pre("save", function (next) {
  var user = this;

  // Only when change password
  if (user.isModified("password")) {
    // Encrypt password.
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) return next(err);
      bcrypt.hash(user.password, salt, function (err, hash) {
        // Store hash in your password DB.
        if (err) return next(err);
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

userSchema.methods.comparePassword = function (plainPassword, cb) {
  // Check plainPassword and encrypted password
  bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

userSchema.methods.generateToken = function (cb) {
  var user = this;

  // Generate token using jsonwebtoken
  var token = jwt.sign(user._id.toHexString(), "secretToken");
  // user._id + "secretToken" = token
  // "secretToken" -> user._id

  user.token = token;
  user.save(function (err, user) {
    if (err) return cb(err);
    cb(null, user);
  });
};

// Authentication
userSchema.statics.findByToken = function (token, cb) {
  var user = this;

  // Decode token, verify a token.
  jwt.verify(token, "secretToken", function (err, decoded) {
    // decoded = user._id
    // Check if Client's token and DB's token match.
    user.findOne({ _id: decoded, token: token }, function (err, user) {
      if (err) return cb(err);
      cb(null, user);
    });
  });
};

// Wrap the schema with model.
const User = mongoose.model("User", userSchema);

// Export model for use in other files
module.exports = { User };
