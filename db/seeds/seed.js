const db = require("../connection");
const format = require("pg-format");
const { seedFormatter } = require("../../utils/seed-formatting");

const seed = (data) => {
  const { articleData, commentData, topicData, userData } = data;
  return db
    .query("DROP TABLE IF EXISTS comments;")
    .then(() => {
      return db.query("DROP TABLE IF EXISTS articles;");
    })
    .then(() => {
      return db.query("DROP TABLE IF EXISTS topics;");
    })
    .then(() => {
      return db.query("DROP TABLE IF EXISTS users;");
    })
    .then(() => {
      return db.query(`CREATE TABLE users (
        user_name VARCHAR(255) PRIMARY KEY,
        avatar_url TEXT,
        name VARCHAR(255) NOT NULL
      );`);
    })
    .then(() => {
      return db.query(`CREATE TABLE topics (
        topic_name VARCHAR(255) PRIMARY KEY,
        topic_description TEXT NOT NULL
      );`);
    })
    .then(() => {
      return db.query(`CREATE TABLE articles (
        article_id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        body TEXT,
        votes INT DEFAULT 0,
        topic VARCHAR(255) REFERENCES topics(topic_name) NOT NULL,
        author VARCHAR(255) REFERENCES users(user_name) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );`);
    })
    .then(() => {
      return db.query(`CREATE TABLE comments (
        comment_id SERIAL PRIMARY KEY,
        author VARCHAR(255) REFERENCES users(user_name) NOT NULL,
        article_id INT REFERENCES articles(article_id) NOT NULL,
        votes INT DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        body TEXT NOT NULL
      );`);
    })
    .then(() => {
      const usersSql = format(
        `INSERT INTO users
      (user_name, name, avatar_url)
      VALUES
      %L RETURNING *;`,
        seedFormatter(userData)
      );
      return db.query(usersSql);
    })
    .then(() => {
      const topicsSql = format(
        `INSERT INTO topics
      (topic_description, topic_name)
      VALUES
      %L RETURNING *;`,
        seedFormatter(topicData)
      );
      return db.query(topicsSql);
    })
    .then(() => {
      const articlesSql = format(
        `INSERT INTO articles
      (title, topic, author, body, created_at, votes)
      VALUES
      %L RETURNING *;`,
        seedFormatter(articleData)
      );
      return db.query(articlesSql);
    })
    .then(() => {
      const commentsSql = format(
        `INSERT INTO comments
      (body, votes, author, article_id, created_at)
      VALUES
      %L RETURNING *;`,
        seedFormatter(commentData)
      );
      return db.query(commentsSql);
    });
};

module.exports = seed;
