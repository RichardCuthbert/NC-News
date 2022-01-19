const db = require("../db/connection");

// exports.fetchArticleById = (article_id) => {
//   return db
//     .query("SELECT * FROM articles WHERE article_id = $1", [article_id])
//     .then((res) => {
//       const article = res.rows[0];
//       if (!article) {
//         return Promise.reject({
//           status: 404,
//           msg: "Not found",
//         });
//       } else {
//         return article;
//       }
//     });
// };

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
