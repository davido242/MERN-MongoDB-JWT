const mongoose = require("mongoose");

const { MONGO_URL } = process.env;

exports.connect = () => {
  mongoose
  .connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Successfully connected to Db");
  })
  .catch(err => {
    console.log("🚀 ~ file: database.js:17 ~ err:", err)
    console.log("Db Connection failed, exiting now...");
    process.exit(1);
  });
}