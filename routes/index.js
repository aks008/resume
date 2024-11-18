var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('resume/index', { title: 'EzySend Welcome' });
});

router.get('/send', function (req, res, next) {
  res.render('resume/send-mail', { title: 'EzySend Send-Mail' });
});

router.get('/how-it-works', function (req, res, next) {
  console.log("========start");

  res.render('resume/how-works', { title: 'EzySend Works' });
});
module.exports = router;
