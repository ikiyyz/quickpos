var express = require('express');
const { checkLogin } = require('../helpers/utils');
var router = express.Router();

module.exports = function (db) {
  router.get('/', checkLogin, function (req, res, next) {
    res.render('sales/view', {
      user: req.session.user,
      title: 'Sales',
      currentPage: 'sales'
    });
  });

  return router;
};