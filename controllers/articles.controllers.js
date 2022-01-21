const ConnectionParameters = require("pg/lib/connection-parameters");
const {
  fetchArticleById,
  updateVotesByArticleId,
  fetchArticles,
  fetchCommentsByArticleId,
  createComment,
} = require("../models/articles.models");

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticleById(article_id)
    .then((article) => {
      res.status(200).send(article);
    })
    .catch(next);
};

exports.patchVotesByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;

  updateVotesByArticleId(inc_votes, article_id, Object.keys(req.body).length)
    .then((article) => {
      res.status(200).send(article);
    })
    .catch(next);
};

exports.getArticles = (req, res, next) => {
  const { sort_by, order, topic } = req.query;
  fetchArticles(sort_by, order, topic)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  fetchCommentsByArticleId(article_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};
exports.postComment = (req, res, next) => {
  const { body, username } = req.body;
  const { article_id } = req.params;
  createComment(article_id, body, username, Object.keys(req.body).length)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};
