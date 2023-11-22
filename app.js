const express = require("express");
require ("dotenv").config();
require("./config/database").connect();
const User = require("./model/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const cors = require("cors");
const multer = require("multer");
const upload = multer();
const bodyParser = require("body-parser");

const app = express();

app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(upload.none());

app.post("/register", async (req, res) => {
  try {
    const { first_name, last_name, email, password } = req.body;

    if(!(first_name && last_name && email && password)) {
      res.status(400).send("All inpnuts required!");
    }

    const oldUser = await User.findOne({ email });
    if(oldUser) {
      return res.status(409).send("User Already exists, Please Login");
    }

    const encryptPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      first_name,
      last_name,
      email: email.toLowerCase(),
      password: encryptPassword,
    })

    const token = jwt.sign( {user_id: user._id, email}, process.env.TOKEN_KEY, {expiresIn: "1hr",} );

    user.token = token;

    res.status(201).json(user);    
  } catch (error) {
    console.log("🚀 ~ file: app.js:38 ~ app.post ~ error:", error)    
  }
})

app.post("/login", async (req, res) => {
  try{ 
    // get the email and password from forms
    const { email, password } = req.body;
    
    // validate users input
      if(!(email && password)) {
        res.send("Inputs required!");
      }
        
    const user = await User.findOne({ email });
  
    if(user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign({user_id: user._id, email}, process.env.TOKEN_KEY, {expiresIn: "1h"});

      user.token = token;
      res.status(200).json(user)
    } else{
      res.status(400).send("Invalid Credentials");
    }
  } catch(error){
    console.log("🚀 ~ file: app.js:71 ~ app.post ~ error:", error);
    res.send("Something went wrong");
  }
})

module.exports = app;