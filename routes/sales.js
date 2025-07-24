const express = require('express');
const router = express.Router();
const { checkLogin, generateSalesInvoice, formatCurrency } = require('../helpers/utils');
const { Sale, Saleitem, Customer, User, Goods } = require('../models');
const moment = require('moment');

module.exports = function (db) {
  router.get('/', checkLogin, async (req, res) => {
    try {
      const sales = await Sale.findAll({
        include: [
          { model: Customer },
          { model: User, as: 'operatorUser', attributes: ['id', 'name', 'email'] }
        ]
      });
      res.render('sales/list', {
        user: req.session.user,
        sales,
        moment,
        title: 'Sales',
        messages: req.flash(),
        formatCurrency,
        currentPage: 'sales'
      });
    } catch (error) {
      res.status(500).send('Error fetching sales');
    }
  });

  router.get('/add', checkLogin, async (req, res) => {
    try {
      const customers = await Customer.findAll();
      const goods = await Goods.findAll({ order: [['barcode', 'ASC']] });
      const invoice = await generateSalesInvoice(Sale.sequelize);
      res.render('sales/form', {
        user: req.session.user,
        sale: { invoice },
        currentDateTime: moment().format('DD MMM YYYY HH:mm:ss'),
        goods,
        customers,
        title: 'Add Sale',
        messages: req.flash(),
        formatCurrency,
        currentPage: 'sales'
      });
    } catch (error) {
      res.status(500).send('Error preparing add sale');
    }
  });

  router.post('/add', checkLogin, async (req, res) => {
    const t = await Sale.sequelize.transaction();
    try {
      const { customer, items, invoice, pay, change } = req.body;
      if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: 'Minimal 1 item.' });
      }
      const operator = req.session.user && req.session.user.userid;
      let totalsum = 0;
      for (const item of items) {
        const goods = await Goods.findByPk(item.itemcode, { transaction: t });
        if (!goods || goods.stock < item.quantity) throw new Error('Stok tidak cukup');
        totalsum += item.quantity * item.sellingprice;
      }
      await Sale.create({
        invoice,
        customer,
        operator,
        totalsum,
        pay,
        change,
        time: new Date()
      },
        { transaction: t });
      for (const item of items) {
        await Saleitem.create({
          invoice,
          itemcode: item.itemcode,
          quantity: item.quantity,
          sellingprice: item.sellingprice,
          totalprice: item.quantity * item.sellingprice
        },
          { transaction: t });
        const goods = await Goods.findByPk(item.itemcode, { transaction: t });
        goods.stock -= item.quantity;
        await goods.save({ transaction: t });
      }
      await t.commit();
      res.status(201).json({ success: true, invoice });
    } catch (error) {
      await t.rollback();
      res.status(400).json({ error: error.message });
    }
  });

  // Edit sale (form)
  router.get('/edit/:invoice', checkLogin, async (req, res) => {
    try {
      const sale = await Sale.findOne({
        where: { invoice: req.params.invoice },
        include: [
          { model: User, as: 'operatorUser', attributes: ['id', 'name', 'email'] },
          { model: Saleitem, include: [{ model: Goods, attributes: ['name'] }] },
          { model: Customer }
        ]
      });
      const customers = await Customer.findAll();
      const goods = await Goods.findAll({ order: [['barcode', 'ASC']] });
      res.render('sales/form', {
        user: req.session.user,
        sale,
        currentDateTime: moment().format('DD MMM YYYY HH:mm:ss'),
        goods,
        customers,
        title: 'Edit Sale',
        messages: req.flash(),
        formatCurrency,
        currentPage: 'sales'
      });
    } catch (error) {
      res.status(500).send('Error fetching sale');
    }
  });

  // Tambah item ke sale
  router.post('/edit/:invoice/item', checkLogin, async (req, res) => {
    const { invoice } = req.params;
    const { itemcode, quantity, sellingprice } = req.body;
    const t = await Sale.sequelize.transaction();
    try {
      const goods = await Goods.findByPk(itemcode, { transaction: t });
      if (!goods || goods.stock < quantity) throw new Error('Stok tidak cukup');
      const totalprice = quantity * sellingprice;
      await Saleitem.create({
        invoice,
        itemcode,
        quantity,
        sellingprice,
        totalprice
      },
        { transaction: t });
      goods.stock -= quantity;
      await goods.save({ transaction: t });
      const items = await Saleitem.findAll({ where: { invoice }, transaction: t });
      const totalsum = items.reduce((sum, item) => sum + Number(item.totalprice), 0);
      await Sale.update({ totalsum }, { where: { invoice }, transaction: t });
      await t.commit();
      res.status(201).json({ success: true });
    } catch (error) {
      await t.rollback();
      res.status(400).json({ error: error.message });
    }
  });

  router.post('/edit/:invoice', checkLogin, async (req, res) => {
    const { invoice } = req.params;
    const { pay, change, customer } = req.body;
    try {
      await Sale.update({ pay, change, customer }, { where: { invoice } });
      res.status(201).json({ success: true });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  router.post('/delete/:invoice', checkLogin, async (req, res) => {
    const { invoice } = req.params;
    const t = await Sale.sequelize.transaction();
    try {
      const saleItems = await Saleitem.findAll({ where: { invoice }, transaction: t });
      for (const item of saleItems) {
        const goods = await Goods.findByPk(item.itemcode, { transaction: t });
        if (goods) {
          goods.stock += item.quantity;
          await goods.save({ transaction: t });
        }
      }
      await Saleitem.destroy({ where: { invoice }, transaction: t });
      await Sale.destroy({ where: { invoice }, transaction: t });
      await t.commit();
      req.flash('success', 'Sale deleted successfully');
      return res.redirect('/sales');
    } catch (error) {
      await t.rollback();
      req.flash('error', 'Failed to delete sale');
      return res.redirect('/sales');
    }
  });

  router.post('/delete/:id/item', checkLogin, async (req, res) => {
    const { id } = req.params;
    const t = await Sale.sequelize.transaction();
    try {
      const itemToDelete = await Saleitem.findOne({ where: { id }, transaction: t });
      if (!itemToDelete) throw new Error('Item tidak ditemukan');
      const goods = await Goods.findByPk(itemToDelete.itemcode, { transaction: t });
      if (goods) {
        goods.stock += itemToDelete.quantity;
        await goods.save({ transaction: t });
      }
      await Saleitem.destroy({ where: { id }, transaction: t });
      const items = await Saleitem.findAll({ where: { invoice: itemToDelete.invoice }, transaction: t });
      const totalsum = items.reduce((sum, item) => sum + Number(item.totalprice), 0);
      await Sale.update({ totalsum }, { where: { invoice: itemToDelete.invoice }, transaction: t });
      await t.commit();
      res.json({ success: true });
    } catch (error) {
      await t.rollback();
      res.status(500).json({ error: 'Gagal menghapus item' });
    }
  });

  return router;
};