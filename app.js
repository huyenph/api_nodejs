const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const config = require("./config");

console.log(process.env.NODE_ENV);
console.log(process.env.NODE_ENV === "development");
console.log(config.mongo_uri);

const app = express();
const port = process.env.PORT || config.port;
const userRoute = require("./Routes/user");

app.use(bodyParser.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,PATCH");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});
app.use("/users", userRoute);

mongoose
  .connect(config.mongo_uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Connected");
    app.listen(port);
  })
  .catch(e => {
    console.log(e);
  });
