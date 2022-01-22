const express = require("express");
const { getTopics } = require("./controllers/topics.controllers");
const {
  getArticleById,
  patchVotesByArticleId,
  getArticles,
} = require("./controllers/articles.controllers");
const {
  getCommentsByArticleId,
  postComment,
  deleteComment,
} = require("./controllers/comments.controllers");
const { getApi } = require("./controllers/api.controller");

const app = express();

app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);
app.patch("/api/articles/:article_id", patchVotesByArticleId);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id/comments", getCommentsByArticleId);
app.post("/api/articles/:article_id/comments", postComment);
app.delete("/api/comments/:comment_id", deleteComment);
app.get("/api", getApi);

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
