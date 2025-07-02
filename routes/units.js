const express = require('express');
const { checkLogin } = require('../helpers/utils');
const router = express.Router();
const { Unit } = require('../models');

module.exports = function (db) {
  router.get('/', checkLogin, async (req, res) => {
    try {
      const units = await Unit.findAll({
        attributes: ['unit', 'name', 'note']
      });

      res.render('units/list.ejs', {
        title: 'Units',
        units,
        currentPage: 'units',
        user: req.session.user,
        messages: req.flash()
      });
    } catch (error) {
      console.error(error);
      req.flash('error', 'Error fetching units');
      res.redirect('/units');
    }
  });

  // form new unit
  router.get('/add', checkLogin, (req, res) => {
    res.render('units/form.ejs', {
      title: 'Add New Unit',
      unit: null,
      currentPage: 'units',
      user: req.session.user,
      messages: req.flash()
    });
  });
  
  router.get('/edit/:id', checkLogin, async (req, res) => {
    try {
      const unit = await Unit.findByPk(req.params.id);

      if (!unit) {
        req.flash('error', 'Unit not found');
        res.redirect('/units');
        return;
      }

      res.render('units/form.ejs', {
        title: 'Edit Unit',
        unit,
        currentPage: 'units',
        user: req.session.user,
        messages: req.flash()
      });
    } catch (error) {
      console.error(error);
      req.flash('error', 'Error fetching unit');
      res.redirect('/units');
    }
  });

  // Create new unit
  router.post('/add', checkLogin, async (req, res) => {
    try {
      const { name, note } = req.body;
      const unitCode = name.toLowerCase().replace(/\s+/g, '_');

      await Unit.create({
        unit: unitCode,
        name,
        note
      });

      req.flash('success', 'Unit created successfully');
      res.redirect('/units');
    } catch (error) {
      console.error(error);
      req.flash('error', 'Error creating unit');
      res.redirect('/units/add');
    }
  });

  // Update unit
  router.post('/edit/:id', checkLogin, async (req, res) => {
    try {
      const { name, note } = req.body;

      const unit = await Unit.findByPk(req.params.id);
      if (!unit) {
        req.flash('error', 'Unit not found');
        res.redirect('/units');
        return;
      }

      await unit.update({
        name,
        note
      });

      req.flash('success', 'Unit updated successfully');
      res.redirect('/units');
    } catch (error) {
      console.error(error);
      req.flash('error', 'Error updating unit');
      res.redirect(`/units/edit/${req.params.id}`);
    }
  });

  // Delete unit
  router.post('/delete/:id', checkLogin, async (req, res) => {
    try {
      const { id } = req.params;
      await Unit.destroy({
        where: { unit: id }
      });
      req.flash('success', 'Unit deleted successfully');
      res.redirect('/units');
    } catch (error) {
      console.error(error);
      req.flash('error', 'Error deleting unit');
      res.redirect('/units');
    }
  });

  return router;
};