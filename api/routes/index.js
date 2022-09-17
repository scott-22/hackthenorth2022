const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send({
    message: "Hello! You did a GET request, and this is the response."
  });
});

router.post('/', (req, res) => {
  res.send({
    message: "Hello! You did a POST request, and this is the response."
  });
});

module.exports = router;
