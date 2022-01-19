const {
  fetchArticleById,
  updateVotesByArticleId,
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
