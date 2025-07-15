const express = require('express');
const { checkLogin } = require('../helpers/utils');
const router = express.Router();
const { Goods, Unit } = require('../models');
const path = require('path');

module.exports = function (db) {
  router.get('/', checkLogin, async (req, res) => {
    try {
      const goods = await Goods.findAll({
        attributes: ['barcode', 'name', 'stock', 'purchaseprice', 'sellingprice', 'unit', 'picture'],
        include: [{
          model: Unit,
          as: 'unitData',
          attributes: ['name']
        }]
      });

      res.render('goods/list.ejs', {
        title: 'Goods',
        goods,
        currentPage: 'goods-utilities',
        user: req.session.user,
        messages: req.flash()
      });
    } catch (error) {
      console.error(error);
      req.flash('error', 'Error fetching goods');
      res.status(500).render('goods/list.ejs', {
        title: 'Goods',
        goods: [],
        currentPage: 'goods-utilities',
        user: req.session.user,
        messages: req.flash()
      });
    }
  });

  // form new good
  router.get('/add', checkLogin, async (req, res) => {
    try {
      const units = await Unit.findAll({
        attributes: ['unit', 'name']
      });

      res.render('goods/form.ejs', {
        title: 'Add New Good',
        good: null,
        units,
        currentPage: 'goods-utilities',
        user: req.session.user,
        messages: req.flash()
      });
    } catch (error) {
      console.error(error);
      req.flash('error', 'Error fetching units');
      res.status(500).render('goods/form.ejs', {
        title: 'Add New Good',
        good: null,
        units: [],
        currentPage: 'goods-utilities',
        user: req.session.user,
        messages: req.flash()
      });
    }
  });

  router.get('/edit/:barcode', checkLogin, async (req, res) => {
    try {
      const good = await Goods.findByPk(req.params.barcode, {
        include: [
          {
            model: Unit,
            as: 'unitData',
            attributes: ['unit', 'name']
          }
        ]
      });

      if (!good) {
        req.flash('error', 'Good not found');
        res.status(404).render('goods/form.ejs', {
          title: 'Edit Good',
          good: null,
          units: [],
          currentPage: 'goods-utilities',
          user: req.session.user,
          messages: req.flash()
        });
        return;
      }

      const units = await Unit.findAll({
        attributes: ['unit', 'name']
      });

      res.render('goods/form.ejs', {
        title: 'Edit Good',
        good,
        units,
        currentPage: 'goods-utilities',
        user: req.session.user,
        messages: req.flash()
      });
    } catch (error) {
      console.error(error);
      req.flash('error', 'Error fetching good');
      res.status(500).render('goods/form.ejs', {
        title: 'Edit Good',
        good: null,
        units: [],
        currentPage: 'goods-utilities',
        user: req.session.user,
        messages: req.flash()
      });
    }
  });

  router.post('/add', checkLogin, async (req, res) => {
    try {
      const { barcode, name, stock, purchaseprice, sellingprice, unit } = req.body;

      // Handle file upload
      let picturePath = null;
      if (req.files && req.files.picture) {
        const picture = req.files.picture;
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        const allowedExts = ['.jpg', '.jpeg', '.png'];
        const maxSize = 1 * 1024 * 1024; // 1MB
        const fileExt = path.extname(picture.name).toLowerCase();

        if (!allowedTypes.includes(picture.mimetype) || !allowedExts.includes(fileExt) || picture.size > maxSize) {
          req.flash("error", "Invalid image file.");
          return res.redirect("/goods/add");
        }

        const fileName = `${barcode.trim()}_${Date.now()}${fileExt}`;
        const uploadPath = path.join(
          __dirname,
          "../public/uploads",
          fileName
        );

        picture.mv(uploadPath, function (err) {
          if (err) {
            req.flash("error", "Gagal upload: " + err.message);
            return res.redirect("/goods/add");
          }
          console.log("File berhasil diupload ke:", uploadPath);
        });
        picturePath = `/uploads/${fileName}`;
      }

      await Goods.create({
        barcode: barcode.trim(),
        name,
        stock: parseInt(stock) || 0,
        purchaseprice: parseFloat(purchaseprice),
        sellingprice: parseFloat(sellingprice),
        unit,
        picture: picturePath || null
      });

      req.flash('success', 'Good created successfully');
      res.redirect('/goods');
    } catch (error) {
      console.error(error);
      req.flash('error', 'Error creating good');
      res.status(500).render('goods/form.ejs', {
        title: 'Add New Good',
        good: null,
        units: [],
        currentPage: 'goods-utilities',
        user: req.session.user,
        messages: req.flash()
      });
    }
  });

  router.post('/edit/:barcode', checkLogin, async (req, res) => {
    try {
      const { name, stock, purchaseprice, sellingprice, unit } = req.body;

      const good = await Goods.findByPk(req.params.barcode);
      if (!good) {
        req.flash('error', 'Good not found');
        res.status(404).render('goods/form.ejs', {
          title: 'Edit Good',
          good: null,
          units: [],
          currentPage: 'goods-utilities',
          user: req.session.user,
          messages: req.flash()
        });
        return;
      }

      // handle file upload
      let picturePath = good.picture;
      if (req.files && req.files.picture) {
        const picture = req.files.picture;
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        const allowedExts = ['.jpg', '.jpeg', '.png'];
        const maxSize = 1 * 1024 * 1024; // 1MB
        const fileExt = path.extname(picture.name).toLowerCase();

        if (!allowedTypes.includes(picture.mimetype) || !allowedExts.includes(fileExt) || picture.size > maxSize) {
          req.flash("error", "Invalid image file.");
          return res.redirect(`/goods/edit/${req.params.barcode}`);
        }

        const fileName = `${req.params.barcode}_${Date.now()}${fileExt}`;
        const uploadPath = path.join(
          __dirname,
          "../public/uploads",
          fileName
        );

        picture.mv(uploadPath, function (err) {
          if (err) {
            req.flash("error", "Gagal upload: " + err.message);
            return res.redirect(`/goods/edit/${req.params.barcode}`);
          }
          console.log("File berhasil diupload ke:", uploadPath);
        });
        picturePath = `/uploads/${fileName}`;
      }

      await good.update({
        name,
        stock: parseInt(stock) || 0,
        purchaseprice: parseFloat(purchaseprice),
        sellingprice: parseFloat(sellingprice),
        unit,
        picture: picturePath
      });

      req.flash('success', 'Good updated successfully');
      res.redirect('/goods');
    } catch (error) {
      console.error(error);
      req.flash('error', 'Error updating good');
      res.status(500).render('goods/form.ejs', {
        title: 'Edit Good',
        good: null,
        units: [],
        currentPage: 'goods-utilities',
        user: req.session.user,
        messages: req.flash()
      });
    }
  });

  router.post('/delete/:barcode', checkLogin, async (req, res) => {
    try {
      await Goods.destroy({
        where: { barcode: req.params.barcode }
      });
      req.flash('success', 'Good deleted successfully');
      res.redirect('/goods');
    } catch (error) {
      console.error(error);
      req.flash('error', 'Error deleting good');
      res.redirect('/goods');
    }
  });

  return router;
};