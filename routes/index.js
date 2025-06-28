var express = require('express');
const { comparePassword } = require('../helpers/utils');
var router = express.Router();

module.exports = function (db) {
  router.get('/', function (req, res, next) {
    if (req.session.user) {
      return res.redirect('/dashboard');
    }
    const successMessage = req.flash('success');
    const errorMessage = req.flash('error');
    res.render('auth/login', {
      messages: {
        error: errorMessage,
        success: successMessage
      }
    });
  });

  router.get('/login', function (req, res, next) {
    if (req.session.user) {
      return res.redirect('/dashboard');
    }
    const successMessage = req.flash('success');
    const errorMessage = req.flash('error');
    res.render('auth/login', {
      messages: {
        error: errorMessage,
        success: successMessage
      }
    });
  });

  router.post('/login', async function (req, res, next) {
    const { email, password } = req.body;
    try {
      const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);

      if (result.rows.length === 0) {
        req.flash('error', 'Email is not registered');
        return res.redirect('/login');
      }

      const user = result.rows[0];
      const match = comparePassword(password, user.password);

      if (!match) {
        req.flash('error', 'Password is wrong');
        return res.redirect('/login');
      }

      req.session.user = {
        userid: user.userid,
        email: user.email,
        name: user.name,
        role: user.role,
      };

      return res.redirect('/dashboard');
    } catch (err) {
      req.flash('error', 'Login error: ' + err.message);
      return res.redirect('/login');
    }
  });

  router.get('/logout', function (req, res, next) {
    req.session.destroy((err) => {
      if (err) {
        return res.send('Error saat logout');
      }
      res.clearCookie('connect.sid');
      res.set('Cache-Control', 'no-store');
      res.redirect('/');
    });
  });

  return router;
};