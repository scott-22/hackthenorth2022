const express = require('express');
const router = express.Router();

const { Client } = require("pg");

const dotenv = require('dotenv');
dotenv.config();

const password = process.env.PASSWORD;
const databaseUrl = `postgresql://htn:${password}@free-tier11.gcp-us-east1.cockroachlabs.cloud:26257/defaultdb?sslmode=verify-full&options=--cluster%3Dhackthenorth2022-1941`;
const client = new Client(databaseUrl);

(async () => {
  await client.connect();
})();

/* GET home page. */
router.get('/', async (req, res, next) => {
  const results = await client.query("SELECT NOW()");
  res.send({
    message: "Hello! You did a GET request, and this is the response.",
    resultsFromTestSqlQuery: results,
  });
});

router.post('/', (req, res) => {
  res.send({
    message: "Hello! You did a POST request, and this is the response.",
  });
});

module.exports = router;
