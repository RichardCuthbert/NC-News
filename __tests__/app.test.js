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
