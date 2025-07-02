const express = require('express');
const { checkLogin } = require('../helpers/utils');
const router = express.Router();
const { Supplier } = require('../models');

module.exports = function (db) {
  router.get('/', checkLogin, async (req, res) => {
    try {
      const suppliers = await Supplier.findAll({
        attributes: ['supplierid', 'name', 'address', 'phone']
      });

      res.render('suppliers/list.ejs', {
        title: 'Suppliers',
        suppliers,
        currentPage: 'suppliers',
        user: req.session.user,
        messages: req.flash()
      });
    } catch (error) {
      console.error(error);
      req.flash('error', 'Error fetching suppliers');
      res.redirect('/suppliers');
    }
  });

  // form new supplier
  router.get('/add', checkLogin, (req, res) => {
    res.render('suppliers/form.ejs', {
      title: 'Add New Supplier',
      supplier: null,
      currentPage: 'suppliers',
      user: req.session.user,
      messages: req.flash()
    });
  });

  router.get('/edit/:id', checkLogin, async (req, res) => {
    try {
      const supplier = await Supplier.findByPk(req.params.id);

      if (!supplier) {
        req.flash('error', 'Supplier not found');
        res.redirect('/suppliers');
        return;
      }

      res.render('suppliers/form.ejs', {
        title: 'Edit Supplier',
        supplier,
        currentPage: 'suppliers',
        user: req.session.user,
        messages: req.flash()
      });
    } catch (error) {
      console.error(error);
      req.flash('error', 'Error fetching supplier');
      res.redirect('/suppliers');
    }
  });

  router.post('/add', checkLogin, async (req, res) => {
    try {
      const { name, address, phone } = req.body;

      await Supplier.create({
        name,
        address,
        phone
      });

      req.flash('success', 'Supplier created successfully');
      res.redirect('/suppliers');
    } catch (error) {
      console.error(error);
      req.flash('error', 'Error creating supplier');
      res.redirect('/suppliers/add');
    }
  });

  router.post('/edit/:id', checkLogin, async (req, res) => {
    try {
      const { name, address, phone } = req.body;

      const supplier = await Supplier.findByPk(req.params.id);
      if (!supplier) {
        req.flash('error', 'Supplier not found');
        res.redirect('/suppliers');
        return;
      }

      await supplier.update({
        name,
        address,
        phone
      });

      req.flash('success', 'Supplier updated successfully');
      res.redirect('/suppliers');
    } catch (error) {
      console.error(error);
      req.flash('error', 'Error updating supplier');
      res.redirect(`/suppliers/edit/${req.params.id}`);
    }
  });

  router.post('/delete/:id', checkLogin, async (req, res) => {
    try {
      const { id } = req.params;
      await Supplier.destroy({
        where: { supplierid: id }
      });
      req.flash('success', 'Supplier deleted successfully');
      res.redirect('/suppliers');
    } catch (error) {
      console.error(error);
      req.flash('error', 'Error deleting supplier');
      res.redirect('/suppliers');
    }
  });

  return router;
};