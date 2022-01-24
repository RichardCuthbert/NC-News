const db = require("../db/connection");
const { seedFormatter } = require("../utils/seed-formatting");

afterAll(() => db.end());

describe("seedFormatter()", () => {
  it("returns an empty array when passed an empty array", () => {
    expect(seedFormatter([])).toEqual([]);
  });
  it("takes an array of objects and returns a two-dimensional array whose inner arrays contain the values present in the objects of the input array ", () => {
    const input = [
      {
        username: "tickle122",
        name: "Tom Tickle",
        avatar_url:
          "https://vignette.wikia.nocookie.net/mrmen/images/d/d6/Mr-Tickle-9a.png/revision/latest?cb=20180127221953",
      },
      {
        username: "grumpy19",
        name: "Paul Grump",
        avatar_url:
          "https://vignette.wikia.nocookie.net/mrmen/images/7/78/Mr-Grumpy-3A.PNG/revision/latest?cb=20170707233013",
      },
      {
        username: "happyamy2016",
        name: "Amy Happy",
        avatar_url:
          "https://vignette1.wikia.nocookie.net/mrmen/images/7/7f/Mr_Happy.jpg/revision/latest?cb=20140102171729",
      },
    ];

    const output = [
      [
        "tickle122",
        "Tom Tickle",
        "https://vignette.wikia.nocookie.net/mrmen/images/d/d6/Mr-Tickle-9a.png/revision/latest?cb=20180127221953",
      ],
      [
        "grumpy19",
        "Paul Grump",
        "https://vignette.wikia.nocookie.net/mrmen/images/7/78/Mr-Grumpy-3A.PNG/revision/latest?cb=20170707233013",
      ],
      [
        "happyamy2016",
        "Amy Happy",
        "https://vignette1.wikia.nocookie.net/mrmen/images/7/7f/Mr_Happy.jpg/revision/latest?cb=20140102171729",
      ],
    ];

    expect(seedFormatter(input)).toEqual(output);
  });
  it("does not mutate array", () => {
    const input = [
      {
        username: "tickle122",
        name: "Tom Tickle",
        avatar_url:
          "https://vignette.wikia.nocookie.net/mrmen/images/d/d6/Mr-Tickle-9a.png/revision/latest?cb=20180127221953",
      },
      {
        username: "grumpy19",
        name: "Paul Grump",
        avatar_url:
          "https://vignette.wikia.nocookie.net/mrmen/images/7/78/Mr-Grumpy-3A.PNG/revision/latest?cb=20170707233013",
      },
      {
        username: "happyamy2016",
        name: "Amy Happy",
        avatar_url:
          "https://vignette1.wikia.nocookie.net/mrmen/images/7/7f/Mr_Happy.jpg/revision/latest?cb=20140102171729",
      },
    ];

    const copy = [...input];

    seedFormatter(input);

    expect(input).toEqual(copy);
  });
});
