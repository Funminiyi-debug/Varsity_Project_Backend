config = {
  database: {
    development: {
      url: "mongodb://localhost:27017/versity",
    },
    production: {
      url: "",
    },
  },
  image: {
    users: "./upload/userimages",
    products: "./upload/productsimages/",
    filetypes: /jpeg|jpg|png|/,
  },
};

module.exports = config;
