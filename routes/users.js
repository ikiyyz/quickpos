const express = require('express');
const { checkLogin, generatePassword } = require('../helpers/utils');
const router = express.Router();
const { User } = require('../models');
const { Op } = require('sequelize');

module.exports = function (db) {

  function setFlashAndRedirect(req, res, type, message, redirectTo) {
    req.flash(type, message);
    return res.redirect(redirectTo);
  }

  async function findUserOrRedirect(id, req, res) {
    const user = await User.findByPk(id);
    if (!user) {
      return setFlashAndRedirect(req, res, 'error', 'User not found', '/users');
    }
    return user;
  }

  router.get('/', checkLogin, async (req, res) => {
    try {
      const {
        page = 1,
        limit = 10,
        search = '',
        sortBy = 'id',
        sortOrder = 'ASC'
      } = req.query;

      const offset = (+page - 1) * +limit;

      const whereCondition = search ? {
        [Op.or]: [
          { name: { [Op.iLike]: `%${search}%` } },
          { email: { [Op.iLike]: `%${search}%` } },
          { role: { [Op.iLike]: `%${search}%` } }
        ]
      } : {};

      const { count, rows: users } = await User.findAndCountAll({
        where: whereCondition,
        attributes: ['id', 'name', 'email', 'role', 'createdAt'],
        order: [[sortBy, sortOrder]],
        limit: +limit,
        offset
      });

      res.render('users/list.ejs', {
        currentPage: 'users',
        user: req.session.user,
        title: 'Users',
        users,
        limit: +limit,
        pagination: {
          page: +page,
          totalPages: Math.ceil(count / limit),
          totalRecords: count,
          hasNextPage: +page < Math.ceil(count / limit),
          hasPrevPage: +page > 1,
          nextPage: +page + 1,
          prevPage: +page - 1
        },
        search,
        sortBy,
        sortOrder,
        messages: req.flash()
      });
    } catch (err) {
      return setFlashAndRedirect(req, res, 'error', 'Error fetching users: ' + err.message, '/dashboard');
    }
  });

  router.get('/add', checkLogin, (req, res) => {
    res.render('users/form.ejs', {
      currentPage: 'users',
      user: req.session.user,
      title: 'Users',
      action: '/users',
      userData: null,
      messages: req.flash()
    });
  });

  router.post('/add', checkLogin, async (req, res) => {
    try {
      const { name, email, role, password } = req.body;
      const existingUser = await User.findOne({ where: { email } });

      if (existingUser) {
        return setFlashAndRedirect(req, res, 'error', 'Email already exists', '/users/add');
      }

      await User.create({ name, email, role, password: generatePassword(password) });
      return setFlashAndRedirect(req, res, 'success', 'User created successfully', '/users');
    } catch (err) {
      return setFlashAndRedirect(req, res, 'error', 'Error creating user: ' + err.message, '/users/add');
    }
  });

  router.get('/edit/:id', checkLogin, async (req, res) => {
    const user = await findUserOrRedirect(req.params.id, req, res);
    if (!user) return;

    res.render('users/form.ejs', {
      currentPage: 'users',
      user: req.session.user,
      title: 'Users',
      action: `/users/edit/${user.id}`,
      userData: user,
      messages: req.flash()
    });
  });

  router.post('/edit/:id', checkLogin, async (req, res) => {
    try {
      const { name, email, role } = req.body;
      const user = await findUserOrRedirect(req.params.id, req, res);
      if (!user) return;

      if (email !== user.email) {
        const existing = await User.findOne({ where: { email } });
        if (existing && existing.id !== user.id) {
          return setFlashAndRedirect(req, res, 'error', 'Email already exists', `/users/edit/${user.id}`);
        }
      }

      await user.update({ name, email, role });
      return setFlashAndRedirect(req, res, 'success', 'User updated successfully', '/users');
    } catch (err) {
      return setFlashAndRedirect(req, res, 'error', 'Error updating user: ' + err.message, `/users/edit/${req.params.id}`);
    }
  });

  router.post('/delete/:id', checkLogin, async (req, res) => {
    try {
      const user = await findUserOrRedirect(req.params.id, req, res);
      if (!user) return;

      await user.destroy();
      return setFlashAndRedirect(req, res, 'success', 'User deleted successfully', '/users');
    } catch (err) {
      return setFlashAndRedirect(req, res, 'error', 'Error deleting user: ' + err.message, '/users');
    }
  });

  return router;
};
