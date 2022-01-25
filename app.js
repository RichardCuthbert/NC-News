const express = require("express");
const apiRouter = require("./routers/api.router");

const app = express();

app.use(express.json());

app.use("/api", apiRouter);

app.use((err, req, res, next) => {
  if (err.code === "22P02" || err.code === "23503") {
    res.status(400).send({ msg: "Bad request" });
  }
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  }

  //res.status(404).send({ msg: "Not found" });
});

module.exports = app;
