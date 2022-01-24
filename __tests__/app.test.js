const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const testData = require("../db/data/test-data/index.js");
const seed = require("../db/seeds/seed");

beforeEach(() => seed(testData));

afterAll(() => db.end());

describe("/api/topics", () => {
  describe("/GET", () => {
    it("status:200 and returns an array of topics", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then((res) => {
          expect(res.body.topics).toHaveLength(3);
          res.body.topics.forEach((topic) => {
            expect(topic).toEqual(
              expect.objectContaining({
                topic_name: expect.any(String),
                topic_description: expect.any(String),
              })
            );
          });
        });
    });
  });
});

describe("/api/articles/:articleId", () => {
  describe("/GET", () => {
    it("status:200 and returns the article whose ID matches that specified", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then((response) => {
          expect(response.body.article).toEqual(
            expect.objectContaining({
              article_id: 1,
              title: expect.any(String),
              body: expect.any(String),
              votes: expect.any(Number),
              topic: expect.any(String),
              author: expect.any(String),
              created_at: expect.any(String),
              comment_count: expect.any(Number),
            })
          );
        });
    });
    it("status:400 and returns a bad request message when an incorrect article ID is specified", () => {
      return request(app)
        .get("/api/articles/swrg")
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe("Bad request");
        });
    });
    it("status:404 and returns a not found message when the specified article ID does not exist in the database", () => {
      return request(app)
        .get("/api/articles/312")
        .expect(404)
        .then((res) => {
          expect(res.body.msg).toBe("Not found");
        });
    });
  });
  describe("/PATCH", () => {
    it("status:200 and returns an article whose vote is incremented by the specified amount when that amount is > 0", () => {
      const incVotes = { inc_votes: 1 };
      return request(app)
        .patch("/api/articles/1")
        .send(incVotes)
        .expect(200)
        .then((res) => {
          expect(res.body.article).toEqual({
            article_id: 1,
            title: expect.any(String),
            body: expect.any(String),
            votes: 101,
            topic: expect.any(String),
            author: expect.any(String),
            created_at: expect.any(String),
          });
        });
    });
    it("status:200 and returns an article whose vote is unchanged when inc_votes is 0", () => {
      const incVotes = { inc_votes: 0 };
      return request(app)
        .patch("/api/articles/1")
        .send(incVotes)
        .expect(200)
        .then((res) => {
          expect(res.body.article).toEqual({
            article_id: 1,
            title: expect.any(String),
            body: expect.any(String),
            votes: 100,
            topic: expect.any(String),
            author: expect.any(String),
            created_at: expect.any(String),
          });
        });
    });
    it("status:200 and returns an article whose vote is unchanged when inc_votes is missing from the request body", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({})
        .expect(200)
        .then((res) => {
          expect(res.body.article).toEqual({
            article_id: 1,
            title: expect.any(String),
            body: expect.any(String),
            votes: 100,
            topic: expect.any(String),
            author: expect.any(String),
            created_at: expect.any(String),
          });
        });
    });
    it("status:200 and returns an article whose vote is decremented by the spefified amount when that amount is < 0", () => {
      const incVotes = { inc_votes: -1 };
      return request(app)
        .patch("/api/articles/1")
        .send(incVotes)
        .expect(200)
        .then((res) => {
          expect(res.body.article).toEqual({
            article_id: 1,
            title: expect.any(String),
            body: expect.any(String),
            votes: 99,
            topic: expect.any(String),
            author: expect.any(String),
            created_at: expect.any(String),
          });
        });
    });
    it("status:400 and returns a bad request message when req.body's inc_votes property is of an incorrect data type", () => {
      const obj = { inc_votes: "hi" };
      return request(app)
        .patch("/api/articles/1")
        .send(obj)
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe("Bad request");
        });
    });
    it("status:400 and returns a bad request message when req.body has more than one property", () => {
      const obj = { inc_votes: 0, z: "hi" };
      return request(app)
        .patch("/api/articles/1")
        .send(obj)
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe("Bad request");
        });
    });
    it("status:404 and returns a not found message when the specified article ID does not exist in the database", () => {
      const incVotes = { inc_votes: 0 };
      return request(app)
        .patch("/api/articles/312")
        .send(incVotes)
        .expect(404)
        .then((res) => {
          expect(res.body.msg).toBe("Not found");
        });
    });
  });
});

describe("/api/articles", () => {
  describe("/GET", () => {
    it("status:200 and returns an array of all articles in the database when no queries are specified", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then((res) => {
          expect(res.body.articles).toHaveLength(12);
          res.body.articles.forEach((article) => {
            expect(article).toEqual(
              expect.objectContaining({
                article_id: expect.any(Number),
                title: expect.any(String),
                body: expect.any(String),
                votes: expect.any(Number),
                topic: expect.any(String),
                author: expect.any(String),
                created_at: expect.any(String),
                comment_count: expect.any(Number),
              })
            );
          });
        });
    });
    it("status:200 and returns articles by date created in descending order when no queries are specified", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then((res) => {
          expect(res.body.articles).toBeSortedBy("created_at", {
            descending: true,
          });
        });
    });
    it("status:200 and returns articles in descending order according to the column specified in the sort_by query when this is the only query specified", () => {
      return request(app)
        .get("/api/articles?sort_by=article_id")
        .expect(200)
        .then((res) => {
          expect(res.body.articles).toBeSortedBy("article_id", {
            descending: true,
          });
        });
    });
    it("status:200 and returns articles sorted by date created in the order specified by the order query when this is the only query specified", () => {
      return request(app)
        .get("/api/articles?order=asc")
        .expect(200)
        .then((res) => {
          expect(res.body.articles).toBeSortedBy("created_at", {
            descending: false,
          });
        });
    });
    it("status:200 and returns articles sorted by the column specified in the sort_by query and ordered by the order specified in the order query when both of these queries are specified", () => {
      return request(app)
        .get("/api/articles?sort_by=article_id&order=asc")
        .expect(200)
        .then((res) => {
          expect(res.body.articles).toBeSortedBy("article_id", {
            descending: false,
          });
        });
    });
    it("status:200 and returns articles filtered by the topic specified in the topic query if a topic query is specified", () => {
      return request(app)
        .get("/api/articles?topic=mitch")
        .expect(200)
        .then((res) => {
          res.body.articles.forEach((article) => {
            expect(article).toEqual(
              expect.objectContaining({
                article_id: expect.any(Number),
                title: expect.any(String),
                body: expect.any(String),
                votes: expect.any(Number),
                topic: "mitch",
                author: expect.any(String),
                created_at: expect.any(String),
                comment_count: expect.any(Number),
              })
            );
          });
        });
    });
    it("status:404 and returns a not found message when the specified topic is not in the database", () => {
      return request(app)
        .get("/api/articles?topic=wefE")
        .expect(404)
        .then((res) => {
          expect(res.body.msg).toBe("Not found");
        });
    });
    it("status:200 and returns an empty array when the specified topic is in the database, but does not match any articles", () => {
      return request(app)
        .get("/api/articles?topic=paper")
        .expect(200)
        .then((res) => {
          expect(res.body.articles).toEqual([]);
        });
    });
    it("status:400 and returns an invalid sort query message when the column specified by the sort_by query does not exist in the database", () => {
      return request(app)
        .get("/api/articles?sort_by=srg")
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe("Invalid sort query");
        });
    });
    it("status:400 and returns an invalid order message when an order other than asc or desc is specified", () => {
      return request(app)
        .get("/api/articles?order=ewg")
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe("Invalid order query");
        });
    });
  });
});

describe("/api/articles/:article_id/comments", () => {
  describe("/GET", () => {
    it("status:200 and returns an array of comments for the specified article id", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then((res) => {
          expect(
            res.body.comments.forEach((comment) => {
              expect(comment).toEqual(
                expect.objectContaining({
                  comment_id: expect.any(Number),
                  votes: expect.any(Number),
                  created_at: expect.any(String),
                  author: expect.any(String),
                  body: expect.any(String),
                })
              );
            })
          );
        });
    });
    it("status:200 and returns an empty array when there are no comments on the article specified", () => {
      return request(app)
        .get("/api/articles/4/comments")
        .expect(200)
        .then((res) => {
          expect(res.body.comments).toEqual([]);
        });
    });
    it("status:404 and returns a not found message when the article id specified does not exist in the database", () => {
      return request(app)
        .get("/api/articles/321/comments")
        .expect(404)
        .then((res) => {
          expect(res.body.msg).toBe("Not found");
        });
    });
    it("status:400 and returns a bad request message when the article id specified is not a valid article id", () => {
      return request(app)
        .get("/api/articles/hello/comments")
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe("Bad request");
        });
    });
  });
  describe("/POST", () => {
    it("status:201 and returns the posted comment when an object with arropriate username and body is provided and a valid article id is specified", () => {
      return request(app)
        .post("/api/articles/1/comments")
        .send({
          username: "rogersop",
          body: "yo",
        })
        .expect(201)
        .then((res) => {
          expect(res.body.comment).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              article_id: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
            })
          );
        });
    });
    it("status:400 and returns a bad request message when req.body does not contain a comment body", () => {
      return request(app)
        .post("/api/articles/1/comments")
        .send({
          username: "rogersop",
        })
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe("Bad request");
        });
    });
    it("status:400 and returns a bad request message when req.body does not contain a username", () => {
      return request(app)
        .post("/api/articles/1/comments")
        .send({
          body: "rogersop",
        })
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe("Bad request");
        });
    });
    it("status:400 and returns a bad request message when req.body is empty", () => {
      return request(app)
        .post("/api/articles/1/comments")
        .send({})
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe("Bad request");
        });
    });
    it("status:201 and ignores unnecessary properties when req.body includes fields other than a username and comment body", () => {
      return request(app)
        .post("/api/articles/1/comments")
        .send({
          username: "rogersop",
          body: "yo",
          zap: "hello",
        })
        .expect(201)
        .then((res) => {
          expect(res.body.comment).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              article_id: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
            })
          );
        });
    });
    it("status:400 and returns a bad request message when the comment body is an empty string", () => {
      return request(app)
        .post("/api/articles/1/comments")
        .send({
          username: "rogersop",
          body: "",
        })
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe("Bad request");
        });
    });
    it("status:400 and returns a bad request message when the username is an empty string", () => {
      return request(app)
        .post("/api/articles/1/comments")
        .send({
          username: "",
          body: "yo",
        })
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe("Bad request");
        });
    });
    it("status:400 and returns a bad request message if the datatype of username is wrong", () => {
      return request(app)
        .post("/api/articles/1/comments")
        .send({
          username: 1,
          body: "yo",
        })
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe("Bad request");
        });
    });
    it("status:404 and returns a not found message if the username does not exist in the database", () => {
      return request(app)
        .post("/api/articles/1/comments")
        .send({
          username: "sav",
          body: "yo",
        })
        .expect(404)
        .then((res) => {
          expect(res.body.msg).toBe("Not found");
        });
    });
    it("status:400 and returns a bad request message if the datatype of body is wrong", () => {
      return request(app)
        .post("/api/articles/1/comments")
        .send({
          username: "rogersop",
          body: 1,
        })
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe("Bad request");
        });
    });
    it("status:404 and returns a not found message when the article id specified does not exist in the database", () => {
      return request(app)
        .post("/api/articles/312/comments")
        .send({
          username: "rogersop",
          body: "yo",
        })
        .expect(404)
        .then((res) => {
          expect(res.body.msg).toBe("Not found");
        });
    });
    it("status:400 and returns a bad request message when the article id specified is not a valid article id", () => {
      return request(app)
        .post("/api/articles/hello/comments")
        .send({
          username: "rogersop",
          body: "yo",
        })
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe("Bad request");
        });
    });
  });
});

describe("/api/comments/:comment_id", () => {
  describe("DELETE", () => {
    it("status:204, responds with no content, and removes the comment whose id is specified", () => {
      return request(app)
        .delete("/api/comments/1")
        .expect(204)
        .then((res) => {
          expect(res.body).toEqual({});
          return db
            .query("SELECT * FROM comments WHERE comment_id = 1")
            .then((res) => {
              expect(res.rows.length).toBe(0);
            });
        });
    });
    it("status:400 and returns a bad request message if the specified comment ID is of the wrong datatype", () => {
      return request(app)
        .delete("/api/comments/wef")
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe("Bad request");
        });
    });
    it("status:404 and returns a not found message if the specified comment ID does not exist in the database", () => {
      return request(app)
        .delete("/api/comments/312")
        .expect(404)
        .then((res) => {
          expect(res.body.msg).toBe("Not found");
        });
    });
  });
});

describe("/api", () => {
  describe("/GET", () => {
    it("status:200 and responds with JSON describing all of the endpoints", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then((res) => {
          expect(Object.keys(res.body.endpoints)).toHaveLength(8);
          expect(res.body.endpoints).toEqual(
            expect.objectContaining({
              "GET /api": {
                description:
                  "serves up a json representation of all the available endpoints of the api",
              },
              "GET /api/topics": {
                description: "serves an array of all topics",
                queries: [],
                exampleResponse: {
                  topics: [
                    {
                      topic_name: "football",
                      topic_description: "Footie!",
                    },
                  ],
                },
              },
              "GET /api/articles/article_id": {
                description:
                  "serces the article specified by the article_id parameter",
                queries: [],
                exampleResponse: {
                  article: {
                    article_id: 1,
                    title: "Running a Node App",
                    body: "This is part two of a series on how to get up and running with Systemd and Node.js. This part dives deeper into how to successfully run your app with systemd long-term, and how to set it up in a production environment.",
                    votes: 28,
                    topic: "coding",
                    author: "jessjelly",
                    created_at: "2020-11-07T06:03:00.000Z",
                    comment_count: 13,
                  },
                },
              },
              "GET /api/articles": {
                description: "serves an array of all articles",
                queries: ["topic", "sort_by", "order"],
                exampleResponse: {
                  articles: [
                    {
                      article_id: 1,
                      title: "Seafood substitutions are increasing",
                      body: "Text from the article..",
                      votes: 0,
                      topic: "cooking",
                      author: "weegembump",
                      created_at: 1527695953341,
                      comment_count: 1,
                    },
                  ],
                },
              },
              "PATCH /api/articles/:article_id": {
                description:
                  "increments the votes of the article whose ID matches that specified in the article_id parameter by the amount specified in the request body's inc_votes entry, and serves the updated article",
                queries: [],
                exampleResponse: {
                  article: {
                    article_id: 1,
                    title: "Running a Node App",
                    body: "This is part two of a series on how to get up and running with Systemd and Node.js. This part dives deeper into how to successfully run your app with systemd long-term, and how to set it up in a production environment.",
                    votes: 28,
                    topic: "coding",
                    author: "jessjelly",
                    created_at: "2020-11-07T06:03:00.000Z",
                  },
                },
              },
              "GET /api/articles/:article_id/comments": {
                description:
                  "serves an array of coments for the article_id provided in the parameter",
                queries: [],
                exampleResponse: {
                  comments: [
                    {
                      comment_id: 31,
                      votes: 11,
                      created_at: "2020-09-26T17:16:00.000Z",
                      author: "weegembump",
                      body: "Sit sequi odio suscipit. Iure quisquam qui alias distinctio eos officia enim aut sit. Corrupti ut praesentium ut iste earum itaque qui. Dolores in ab rerum consequuntur. Id ab aliquid autem dolore",
                    },
                  ],
                },
              },
              "POST /api/articles/:article_id/comments": {
                description:
                  "posts a comment, consisting of the contents of req.body's body entry, to the article specified by the article_id parameter, on behalf of the user whose username is specified in req.body's username entry, and serves the posted article",
                queries: [],
                exampleResponse: {
                  comment: {
                    comment_id: 321,
                    author: "tickle122",
                    article_id: 1,
                    votes: 0,
                    created_at: "2022-01-22T11:58:13.424Z",
                    body: "hello",
                  },
                },
              },
              "DELETE /api/comments/:comment_id": {
                description:
                  "deletes the comment specified in the comment_id parameter",
                queries: [],
                exampleResponse: {},
              },
            })
          );
        });
    });
  });
});
