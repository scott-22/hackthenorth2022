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

// Velocities
router.get('/velocities', async (req, res) => {
  const results = await client.query("SELECT * FROM velocities ORDER BY time LIMIT 100");
  res.send(results.rows);
});

router.post('/velocities', async (req, res) => {
  // Confirm that the data matches the desired format
  if (req.body.hasOwnProperty("data")) {
    await client.query("INSERT INTO velocities(time, value) VALUES(CURRENT_TIMESTAMP, $1);", [req.body.data]);
    res.send(req.body);
  } else {
    res.status(400).send({
      message: "Body must have a 'data' property. Instead received " + JSON.stringify(req.body)
    });
  }
});

// Pose types
router.get('/pose_types', async (req, res) => {
  const results = await client.query("SELECT * FROM pose_types ORDER BY time LIMIT 100");
  res.send(results.rows);
});

router.post('/pose_types', async (req, res) => {
  // Confirm that the data matches the desired format
  if (req.body.hasOwnProperty("data")) {
    await client.query(`INSERT INTO pose_types(time, type) VALUES(CURRENT_TIMESTAMP, ${req.body.data});`);
    res.send(req.body);
  } else {
    res.status(400).send({
      message: "Body must have a 'data' property. Instead received " + JSON.stringify(req.body)
    });
  }
});

module.exports = router;
