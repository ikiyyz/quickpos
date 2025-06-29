const express = require('express');
const { checkLogin } = require('../helpers/utils');
const router = express.Router();
const { Unit } = require('../models');
const { Op } = require('sequelize');

module.exports = function (db) {
  router.get('/', checkLogin, async (req, res) => {
    try {
      const {
        page = 1,
        limit = 10,
        search = '',
        sortBy = 'name',
        sortOrder = 'ASC'
      } = req.query;

      const offset = (+page - 1) * +limit;

      const whereCondition = search ? {
        [Op.or]: [
          { name: { [Op.iLike]: `%${search}%` } },
          { note: { [Op.iLike]: `%${search}%` } }
        ]
      } : {};

      const { count, rows: units } = await Unit.findAndCountAll({
        where: whereCondition,
        attributes: ['unit', 'name', 'note'],
        order: [[sortBy, sortOrder]],
        limit: +limit,
        offset
      });

      res.render('units/list.ejs', {
        title: 'Units',
        units,
        currentPage: 'units',
        totalItems: count,
        currentPage: +page,
        totalPages: Math.ceil(count / +limit),
        search,
        sortBy,
        sortOrder,
        user: req.session.user,
        messages: req.flash()
      });
    } catch (error) {
      console.error(error);
      req.flash('error', 'Error fetching units');
      res.redirect('/units');
    }
  });

  // Show form for new unit
  router.get('/add', checkLogin, (req, res) => {
    res.render('units/form.ejs', {
      title: 'Add New Unit',
      unit: null,
      currentPage: 'units',
      user: req.session.user,
      messages: req.flash()
    });
  });

  // Show form for editing unit
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