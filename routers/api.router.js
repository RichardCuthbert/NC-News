const apiRouter = express.Router();
const topicsRouter = require("./topics.router");
const articlesRouter = require("./articles.router");
const commentsRouter = require("./comments.router");
const { getApi } = require("../controllers/api.controller");

const express = require("express");

apiRouter.use("/topics", topicsRouter);

apiRouter.use("/articles", articlesRouter);

apiRouter.use("/comments", commentsRouter);

apiRouter.get("/", getApi);

module.exports = apiRouter;
