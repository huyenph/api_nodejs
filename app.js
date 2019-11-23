const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();
const userRoute = require("./Routes/user");

app.use(bodyParser.urlencoded())
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,PATCH");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
})
app.use("/users", userRoute);

mongoose
  .connect(
    "mongodb+srv://api_nodejs:0123456@cluster0-2rutv.mongodb.net/api_nodejs?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    console.log("Connected");
    app.listen(8080);
  })
  .catch(e => {
    console.log(e);
  });
