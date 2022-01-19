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
              article_id: 1 /*expect.any(Number)*/,
              title: expect.any(String),
              body: expect.any(String),
              votes: expect.any(Number),
              topic: expect.any(String),
              author: expect.any(String),
              created_at: expect.any(String),
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
    it("status:404 and returns a not found message", () => {
      return request(app)
        .get("/api/articles/312")
        .expect(404)
        .then((res) => {
          expect(res.body.msg).toBe("Not found");
        });
    });
  });
});
