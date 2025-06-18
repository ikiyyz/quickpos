var express = require('express');
const { checkLogin } = require('../helpers/utils');
var router = express.Router();

module.exports = function (db) {
  router.get('/', checkLogin, function (req, res, next) {
    res.render('suppliers/view', {
      user: req.session.user,
      title: 'Suppliers',
      currentPage: 'suppliers'
    });
  });

  return router;
};