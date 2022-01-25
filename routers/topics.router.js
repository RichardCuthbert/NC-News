const { getTopics } = require("../controllers/topics.controllers");
const express = require("express");
const filmsRouter = express.Router();

filmsRouter.get("/", getTopics);

module.exports = filmsRouter;
