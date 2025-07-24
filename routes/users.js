const express = require('express');
const { checkLogin, generatePassword, comparePassword } = require('../helpers/utils');
const router = express.Router();
const { User } = require('../models');

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
      const users = await User.findAll({
        attributes: ['id', 'name', 'email', 'role', 'createdAt']
      });

      res.render('users/list.ejs', {
        currentPage: 'users',
        user: req.session.user,
        title: 'Users',
        users,
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

  router.get('/profile', checkLogin, async (req, res) => {
    const userId = req.session.user.id || req.session.user.userid;
    const user = await User.findByPk(userId);
    if (!user) {
        req.flash('error', 'User not found');
        return res.redirect('/dashboard');
    }
    res.render('users/profile', {
        currentPage: 'profile',
        user: req.session.user,
        title: 'Profile',
        profile: user,
        messages: req.flash()
    });
});

router.post('/profile', checkLogin, async (req, res) => {
    try {
        const userId = req.session.user.id || req.session.user.userid;
        const user = await User.findByPk(userId);
        if (!user) {
            req.flash('error', 'User not found');
            return res.redirect('/dashboard');
        }
        const { name, email } = req.body;
        if (email !== user.email) {
            const existing = await User.findOne({ where: { email } });
            if (existing && existing.id !== user.id) {
                req.flash('error', 'Email already exists');
                return res.redirect('/users/profile');
            }
        }
        await user.update({ name, email });
        const updatedUser = await User.findByPk(userId);
        req.session.user = {
            id: updatedUser.id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role
        };
        req.session.save(() => {
            req.flash('success', 'Profile updated successfully');
            return res.redirect('/users/profile');
        });
    } catch (err) {
        req.flash('error', 'Error updating profile: ' + err.message);
        return res.redirect('/users/profile');
    }
});

router.get('/changepassword', checkLogin, async (req, res) => {
    res.render('users/changepassword.ejs', {
        user: req.session.user,
        title: 'Change Password',
        messages: req.flash()
    });
});

router.post('/changepassword', checkLogin, async (req, res) => {
    try {
        const userId = req.session.user.id || req.session.user.userid;
        const { oldPassword, newPassword, retypePassword } = req.body;
        const user = await User.findByPk(userId);
        if (!user) {
            req.flash('error', 'User not found');
            return res.redirect('/users/changepassword');
        }
        // old password
        if (!comparePassword(oldPassword, user.password)) {
            req.flash('error', 'Old Password is Wrong');
            return res.redirect('/users/changepassword');
        }
        //  new dan retype
        if (newPassword !== retypePassword) {
            req.flash('error', "Retype Password doesn't match");
            return res.redirect('/users/changepassword');
        }
        // password (hash)
        const hashed = generatePassword(newPassword);
        await user.update({ password: hashed });
        req.flash('success', 'Password updated successfully');
        return res.redirect('/users/changepassword');
    } catch (err) {
        req.flash('error', 'Error updating password: ' + err.message);
        return res.redirect('/users/changepassword');
    }
});

  return router;
};
