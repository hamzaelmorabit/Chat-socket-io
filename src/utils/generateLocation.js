const generateLocation = (url) => {
  return {
    url,
    createdAt: new Date(new Date().getTime()),
  };
};

module.exports = { generateLocation };
