const {
  getArticleById,
  patchVotesByArticleId,
  getArticles,
} = require("../controllers/articles.controllers");
const express = require("express");
const {
  getCommentsByArticleId,
  postComment,
} = require("../controllers/comments.controllers");
const articlesRouter = express.Router();

articlesRouter.get("/:article_id", getArticleById);
articlesRouter.patch("/:article_id", patchVotesByArticleId);
articlesRouter.get("/", getArticles);
articlesRouter.get("/:article_id/comments", getCommentsByArticleId);
articlesRouter.post("/:article_id/comments", postComment);

module.exports = articlesRouter;
