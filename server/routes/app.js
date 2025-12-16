var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  // using code from Dallin Guy Hale's post in the W10 Developer Forum
  res.sendFile(path.join(__dirname, 'dist/cms/browser/index.html'));
});

module.exports = router;