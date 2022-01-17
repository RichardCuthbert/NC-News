exports.seedFormatter = (seedData) => {
  return seedData.map((obj) => {
    return Object.values(obj);
  });
};
