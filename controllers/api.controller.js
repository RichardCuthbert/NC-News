const fs = require("fs");

exports.getApi = (req, res, next) => {
  return fs.readFile(`${__dirname}/../endpoints.json`, "utf8", (err, data) => {
    const endpoints = JSON.parse(data);
    res.status(200).send({ endpoints });
  });
};
