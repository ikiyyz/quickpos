
var express = require('express');
const { checkLogin } = require('../helpers/utils');
var router = express.Router();

module.exports = function (db) {
  router.get('/', checkLogin, function (req, res, next) {
    res.render('dashboard/index.ejs', {
      title: 'Dashboard',
      user: req.session.user,
      currentPage: 'dashboard'
    });
  });

  return router;
}
