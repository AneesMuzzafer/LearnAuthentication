//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");


const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/userDB");
const secret = "ThisIsOurSecret";

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"]});

const User = mongoose.model("User", userSchema);

app.get("/home", (req, res) => {
  res.render("home");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", (req, res) => {
  const newUser = User({
    email: req.body.username,
    password: req.body.password,
  });
  newUser.save((err) => {
    if (err) {
      res.send(err);
    } else {
      res.render("secrets");
    }
  });
});

app.post("/login", (req, res) => {
  const email = req.body.username;
  const password = req.body.password;

  User.findOne(
    {
      email: email,
    },
    (err, foundUser) => {
      if (err) {
        res.send(err);
      } else {
        if (foundUser && foundUser.password === password) {
          res.render("secrets");
        } else {
            res.send("Invalid userId or Password");
        }
      }
    }
  );
});

// app.get("/secrets", (req, res) => {
//     res.render("secrets");
// });

// app.get("/submit", (req, res) => {
//     res.render("submit");
// });

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
