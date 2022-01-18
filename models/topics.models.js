const db = require("../db/connection");

exports.fetchTopics = async () => {
  return db.query("SELECT * FROM topics;").then((result) => {
    if (result.rowCount === 0) {
      throw new error();
    }
    return result.rows;
  });
};
