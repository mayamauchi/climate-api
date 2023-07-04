const PORT = 8000;
const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();

const newspapers = [
  {
    name: "bbc",
    address: "https://www.bbc.com/news/science-environment-56837908",
    base: "https://www.bbc.com",
  },
  {
    name: "reuters",
    address: "https://www.reuters.com/sustainability/",
    base: "https://www.reuters.com",
  },
  {
    name: "npr",
    address: "https://www.npr.org/sections/climate/",
    base: "",
  },
  {
    name: "associatedpress",
    address: "https://apnews.com/climate-and-environment",
    base: "",
  },
  {
    name: "thehill",
    address: "https://thehill.com/policy/energy-environment/",
    base: "",
  },
  {
    name: "theguardian",
    address: "https://www.theguardian.com/us/environment",
    base: "https://www.theguardian.com",
  },
  {
    name: "cbsnews",
    address: "https://www.cbsnews.com/climate-change/",
    base: "",
  },
  {
    name: "newyorktimes",
    address: "https://www.nytimes.com/section/climate",
    base: "https://www.nytimes.com",
  },
  {
    name: "pbs",
    address: "https://www.pbs.org/newshour/tag/climate-change",
    base: "",
  },
  {
    name: "cnn",
    address: "https://www.cnn.com/world/cnn-climate",
    base: "https://www.cnn.com",
  },
];

const articles = [];

newspapers.forEach((newspaper) => {
  axios.get(newspaper.address).then((response) => {
    const html = response.data;
    const $ = cheerio.load(html);
    $('a:contains("climate")', html).each(function () {
      const title = $(this).text();
      const url = $(this).attr("href");
      articles.push({
        title,
        url: newspaper.base + url,
        source: newspaper.name,
      });
    });
  });
});

app.get("/", (req, res) => {
  res.json("Welcome to my Climate News API");
});

app.get("/news", (req, res) => {
  res.json(articles);
});

app.get("/news/:newspaperId", (req, res) => {
  const newspaperId = req.params.newspaperId;

  const newspaperAddress = newspapers.filter(
    (newspaper) => newspaper.name == newspaperId
  )[0].address;
  const newspaperBase = newspapers.filter(
    (newspaper) => newspaper.name == newspaperId
  )[0].base;

  axios
    .get(newspaperAddress)
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      const specificArticles = [];

      $('a:contains("climate")', html).each(function () {
        const title = $(this).text();
        const url = $(this).attr("href");
        specificArticles.push({
          title,
          url: newspaperBase + url,
          source: newspaperId,
        });
      });
      res.json(specificArticles);
    })
    .catch((err) => console.log(err));
});

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`));
