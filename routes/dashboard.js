
var express = require('express');
const { checkLogin } = require('../helpers/utils');
var router = express.Router();

module.exports = function (db) {
  router.get('/', checkLogin, async (req, res) => {
    try {
      res.render('dashboard/index.ejs', {
        title: 'Dashboard',
        user: req.session.user,
        currentPage: 'dashboard'
      });
    } catch (err) {
      req.flash('error', 'Error accessing dashboard: ' + err.message);
      res.redirect('/users');
    }
  });

  return router;
}
