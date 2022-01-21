const db = require("../db/connection");

exports.fetchCommentsByArticleId = (article_id) => {
  return db
    .query(
      `SELECT comment_id, votes, created_at, author, body
     FROM comments
      WHERE article_id=$1`,
      [article_id]
    )
    .then((res) => {
      return db
        .query("SELECT * FROM articles WHERE article_id = $1", [article_id])
        .then((z) => {
          if (z.rows.length === 0) {
            return Promise.reject({ status: 404, msg: "Not found" });
          } else {
            return res.rows;
          }
        });
    });
};

exports.createComment = (article_id, body, username, reqBodyLength) => {
  if (!username || !body || reqBodyLength > 2 || typeof body !== "string") {
    return Promise.reject({
      status: 400,
      msg: "Bad request",
    });
  }

  return db
    .query("SELECT * FROM articles WHERE article_id = $1", [article_id])
    .then((z) => {
      if (z.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not found" });
      } else {
        return db
          .query(
            `INSERT INTO comments
         (article_id, body, author)
          VALUES
          ($1, $2, $3)
          RETURNING *`,
            [article_id, body, username]
          )
          .then((res) => {
            return res.rows[0];
          });
      }
    });
};

exports.removeComment = (comment_id) => {
  if (isNaN(Number.parseInt(comment_id))) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }
  return db
    .query("SELECT * FROM comments WHERE comment_id = $1", [comment_id])
    .then((z) => {
      if (z.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not found" });
      } else {
        return db
          .query("DELETE FROM comments WHERE comment_id = $1 RETURNING *", [
            comment_id,
          ])
          .then((res) => {
            return res.rows;
          });
      }
    });
};
