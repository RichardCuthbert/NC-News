const {
  fetchCommentsByArticleId,
  createComment,
  removeComment,
} = require("../models/comments.models");

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

exports.deleteComment = (req, res, next) => {
  const { comment_id } = req.params;
  removeComment(comment_id).then((deleted) => {
    console.log(deleted);
    res.status(204).send({});
  });
};
