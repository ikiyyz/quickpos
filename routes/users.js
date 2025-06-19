var express = require('express');
const { checkLogin } = require('../helpers/utils');
var router = express.Router();

module.exports = function (db) {
  router.get('/', checkLogin, async function (req, res, next) {
    try {
      const result = await db.query('SELECT userid, email, name, role FROM users ORDER BY userid');
      res.render('users/index.ejs', {
        user: req.session.user,
        title: 'Users',
        currentPage: 'users',
        users: result.rows
      });
    } catch (err) {
      req.flash('error', 'Error fetching users: ' + err.message);
      res.redirect('/dashboard');
    }
  });

  // Add route for displaying users data
  router.get('/data', checkLogin, async function (req, res, next) {
    try {
      const result = await db.query('SELECT userid, email, name, role FROM users ORDER BY userid');
      res.render('users/index.ejs', {
        user: req.session.user,
        title: 'Users Data',
        currentPage: 'users',
        users: result.rows
      });
    } catch (err) {
      req.flash('error', 'Error fetching users data: ' + err.message);
      res.redirect('/dashboard');
    }
  });

  return router;
};