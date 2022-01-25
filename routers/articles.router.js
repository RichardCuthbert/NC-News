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

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchVotesByArticleId);

articlesRouter.get("/", getArticles);

articlesRouter
  .route("/:article_id/comments")
  .get(getCommentsByArticleId)
  .post(postComment);

module.exports = articlesRouter;
