const express = require('express');
const { checkLogin } = require('../helpers/utils');
const router = express.Router();
const { User } = require('../models');

module.exports = function (db) {
  router.get('/', checkLogin, async (req, res) => {
    try {
      const users = await User.findAll({
        attributes: ['id', 'name', 'email', 'role'],
        order: [['id', 'ASC']]
      });
      res.render('users/index.ejs', {
        user: req.session.user,
        title: 'Users',
        currentPage: 'users',
        users: users
      });
    } catch (err) {
      req.flash('error', 'Error fetching users: ' + err.message);
      res.redirect('/dashboard');
    }
  });

  router.get('/create', checkLogin, (req, res) => {
    res.render('users/create.ejs', {
      user: req.session.user,
      title: 'Create User',
      currentPage: 'users'
    });
  });

  router.get('/:id/edit', checkLogin, async (req, res) => {
    try {
      const user = await User.findByPk(req.params.id);
      if (!user) {
        req.flash('error', 'User not found');
        return res.redirect('/users');
      }
      res.render('users/edit.ejs', {
        user: req.session.user,
        title: 'Edit User',
        currentPage: 'users',
        userData: user
      });
    } catch (err) {
      req.flash('error', 'Error fetching user: ' + err.message);
      res.redirect('/users');
    }
  });

  router.post('/:id/delete', checkLogin, async (req, res) => {
    try {
      const user = await User.findOne({ where: { id: req.params.id } });
      if (!user) {
        req.flash('error', 'User not found');
        return res.redirect('/users');
      }
      await user.destroy();
      req.flash('success', 'User has been deleted successfully');
      res.redirect('/users');
    } catch (err) {
      req.flash('error', 'Error deleting user: ' + err.message);
      res.redirect('/users');
    }
  });

  return router;
};