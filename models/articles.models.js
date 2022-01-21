const req = require("express/lib/request");
const ConnectionParameters = require("pg/lib/connection-parameters");
const db = require("../db/connection");

exports.fetchArticleById = (article_id) => {
  return db
    .query(
      `SELECT articles.*, CAST(COUNT(comments.comment_id) AS INT) AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.article_id;`,
      [article_id]
    )
    .then((res) => {
      const article = res.rows[0];
      if (!article) {
        return Promise.reject({
          status: 404,
          msg: "Not found",
        });
      } else {
        return article;
      }
    });
};

exports.updateVotesByArticleId = (inc_votes, article_id, bodyLength) => {
  if ((!inc_votes && inc_votes != 0) || bodyLength > 1) {
    //preempting
    return Promise.reject({
      status: 400,
      msg: "Bad request",
    });
  }
  return db
    .query(
      "UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *",
      [inc_votes, article_id]
    )
    .then((res) => {
      const article = res.rows[0];
      if (!article) {
        return Promise.reject({
          status: 404,
          msg: "Not found",
        });
      }
      return article;
    });
};

exports.fetchArticles = (sort_by, order, topic) => {
  if (!sort_by) {
    sort_by = "created_at";
  }

  if (!order) {
    order = "desc";
  }

  if (
    ![
      "article_id",
      "title",
      "body",
      "votes",
      "topic",
      "author",
      "created_at",
    ].includes(sort_by)
  ) {
    return Promise.reject({ status: 400, msg: "Invalid sort query" });
  }

  if (!["asc", "desc"].includes(order)) {
    return Promise.reject({ status: 400, msg: "Invalid order query" });
  }

  return db
    .query(
      `SELECT articles.*, CAST(COUNT(comments.comment_id) AS INT) AS comment_count
  FROM articles
LEFT JOIN comments ON articles.article_id = comments.article_id
GROUP BY articles.article_id 
ORDER BY ${sort_by} ${order}`
    )
    .then((res) => {
      if (topic) {
        return db
          .query("SELECT * FROM topics WHERE topic_name = $1", [topic])
          .then((res) => {
            if (res.rows.length === 0) {
              return Promise.reject({ status: 404, msg: "Not found" });
            } else {
              return res.rows.filter((article) => article.topic === topic);
            }
          });
      } else {
        return res.rows;
      }
    });
};

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

  /*return db
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
    });*/
};
