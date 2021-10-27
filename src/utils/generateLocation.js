const generateLocation = (username, url) => {
  return {
    url,
    username,
    createdAt: new Date(new Date().getTime()),
  };
};

module.exports = { generateLocation };
