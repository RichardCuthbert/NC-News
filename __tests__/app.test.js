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
    //it("status:404 and returns a not found message when an incorrect path is specified", () => {
    //return request(app)
    //.get("/api/topd")
    //.expect(404)
    //.then(({ body }) => {
    //expect(body.msg).toEqual("Not found");
    //});
    //});
  });
});

describe("/api/articles/:articleId", () => {
  describe("/GET", () => {
    it("status:200 and returns the article whose ID matches that specified", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then((response) => {
          expect(response.body).toEqual(
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
    it("status:201 and returns an article whose vote is incremented by the specified amount when that amount is > 0", () => {
      const incVotes = { inc_votes: 1 };
      return request(app)
        .patch("/api/articles/1")
        .send(incVotes)
        .expect(200)
        .then((res) => {
          expect(res.body).toEqual({
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
    it("status:201 and returns an article whose vote is unchanged when inc_votes is 0", () => {
      const incVotes = { inc_votes: 0 };
      return request(app)
        .patch("/api/articles/1")
        .send(incVotes)
        .expect(200)
        .then((res) => {
          expect(res.body).toEqual({
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
    it("status:201 and returns an article whose vote is decremented by the spefified amount when that amount is < 0", () => {
      const incVotes = { inc_votes: -1 };
      return request(app)
        .patch("/api/articles/1")
        .send(incVotes)
        .expect(200)
        .then((res) => {
          expect(res.body).toEqual({
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
    it("status:400 and returns a bad request message when req.body does not include an inc_votes property", () => {
      const obj = {};
      return request(app)
        .patch("/api/articles/1")
        .send(obj)
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe("Bad request");
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
