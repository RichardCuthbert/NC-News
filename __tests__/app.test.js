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
