const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const userRoute = require("./Routes/user");

const app = express();
app.use(bodyParser.json());
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
