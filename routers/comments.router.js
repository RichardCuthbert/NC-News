const express = require("express");
const commentsRouter = express.Router();
const { deleteComment } = require("../controllers/comments.controllers");

commentsRouter.delete("/:comment_id", deleteComment);
module.exports = commentsRouter;
