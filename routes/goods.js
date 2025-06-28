var express = require('express');
const { checkLogin } = require('../helpers/utils');
var router = express.Router();

module.exports = function (db) {
  router.get('/', checkLogin, function (req, res, next) {
    res.render('goods/index.ejs', {
      user: req.session.user,
      title: 'Goods Utilities',
      currentPage: 'goods-utilities'
    });
  });

  return router;
};