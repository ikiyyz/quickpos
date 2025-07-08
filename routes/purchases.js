const express = require('express');
const { checkLogin, generateInvoice, formatCurrency } = require('../helpers/utils');
const router = express.Router();
const { Purchase, Purchaseitem, Supplier, User, Goods } = require('../models');
const moment = require('moment');

module.exports = function (db) {
  router.get('/', checkLogin, async function (req, res) {
    try {
      const purchases = await Purchase.findAll({
        include: [
          {
            model: Supplier
          }
        ]
      });

      res.render('purchases/list', {
        user: req.session.user,
        purchases,
        moment,
        formatCurrency,
        title: 'Purchases',
        messages: req.flash()
      });
    } catch (error) {
      console.log(error);
    }
  });

  router.get('/add', checkLogin, async function (req, res) {
    try {
      const suppliers = await Supplier.findAll();
      const goods = await Goods.findAll({
        order: [['barcode', 'ASC']]
      });
      const now = moment();
      const currentDateTime = now.format('DD MMM YYYY HH:mm:ss');
      const invoice = await generateInvoice(Purchase.sequelize);

      res.render('purchases/form', {
        user: req.session.user,
        purchase: { invoice },
        currentDateTime,
        goods,
        suppliers,
        formatCurrency,
        title: 'Add Purchase',
        messages: req.flash()
      });
    } catch (error) {
      console.log(error);
    }
  });

  router.post('/add', checkLogin, async function (req, res) {
    try {
      const { supplier, items, invoice } = req.body;

      // Validasi minimal 1 item
      if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: 'Minimal 1 item.' });
      }

      // Validasi supplier
      if (!supplier) {
        return res.status(400).json({ error: 'Silakan pilih supplier.' });
      }

      // Validasi item
      const itemCodes = [];
      for (const item of items) {
        if (!item.itemcode || isNaN(item.quantity) || isNaN(item.purchaseprice)) {
          return res.status(400).json({ error: 'Silakan lengkapi data barang.' });
        }
        if (item.quantity < 1) {
          return res.status(400).json({ error: 'Jumlah minimal 1.' });
        }
        if (itemCodes.includes(item.itemcode)) {
          return res.status(400).json({ error: 'Barang ini sudah ada dalam daftar.' });
        }
        itemCodes.push(item.itemcode);
      }

      const operator = req.session.user && req.session.user.userid;
      let totalsum = 0;
      const purchaseItems = items.map(item => {
        const quantity = parseInt(item.quantity);
        const purchaseprice = parseFloat(item.purchaseprice);
        const totalprice = purchaseprice * quantity;
        totalsum += totalprice;
        return {
          invoice,
          itemcode: item.itemcode,
          quantity,
          purchaseprice,
          totalprice
        };
      });

      await Purchase.create({
        invoice,
        supplier,
        operator,
        totalsum,
        time: new Date()
      });

      await Purchaseitem.bulkCreate(purchaseItems);

      res.status(201).json({ success: true, invoice });
    } catch (error) {
      console.log(error);
      res.status(400).json({ error: error.message });
    }
  });

  router.get('/edit/:invoice', checkLogin, async function (req, res) {
    try {
      const purchase = await Purchase.findOne({
        where: { invoice: req.params.invoice },
        include: [
          {
            model: User,
            as: 'operatorUser',
            attributes: ['id', 'name', 'email']
          },
          {
            model: Purchaseitem,
            include: [
              {
                model: Goods,
                attributes: ['name']
              }
            ]
          }
        ]
      });

      const suppliers = await Supplier.findAll();
      const goods = await Goods.findAll({
        order: [['barcode', 'ASC']]
      });

      const now = moment();
      const currentDateTime = now.format('DD MMM YYYY HH:mm:ss');

      res.render('purchases/form', {
        user: req.session.user,
        purchase,
        currentDateTime,
        goods,
        suppliers,
        formatCurrency,
        title: 'Edit Purchase',
        messages: req.flash()
      });
    } catch (error) {
      console.log(error);
    }
  });

  router.post('/edit/:invoice/item', checkLogin, async function (req, res) {
    const { invoice } = req.params;
    const { itemcode, quantity, purchaseprice, totalprice } = req.body;

    try {
      // Check if purchase exists first
      const purchase = await Purchase.findOne({ where: { invoice } });
      if (!purchase) {
        return res.status(404).json({ error: 'Purchase tidak ditemukan' });
      }

      const purchaseItem = await Purchaseitem.create({
        invoice,
        itemcode,
        quantity,
        purchaseprice,
        totalprice
      });

      const items = await Purchaseitem.findAll({ where: { invoice } });
      const totalsum = items.reduce((sum, item) => sum + Number(item.totalprice), 0);
      await Purchase.update({ totalsum }, { where: { invoice } });

      const item = await Purchaseitem.findOne({
        where: { id: purchaseItem.id },
        include: [{
          model: Goods,
          attributes: ['stock']
        }]
      });

      res.status(201).json({ purchase, item });
    } catch (error) {
      console.log(error);
      res.status(400).json({ error: error.message });
    }
  });

  router.post('/edit/:invoice', checkLogin, async function (req, res) {
    const { invoice } = req.params;
    const { time, supplier } = req.body;

    try {
      await Purchase.update(
        { time, supplier },
        { where: { invoice } }
      );

      const items = await Purchaseitem.findAll({ where: { invoice } });
      const totalsum = items.reduce((sum, item) => sum + Number(item.totalprice), 0);
      await Purchase.update(
        { totalsum },
        { where: { invoice } }
      );
      res.status(201).json({ success: true });
    } catch (error) {
      console.log(error);
      res.status(400).json({ error: error.message });
    }
  });

  // delete purchase
  router.post('/delete/:invoice', checkLogin, async (req, res) => {
    const { invoice } = req.params;

    try {
      // delete items first (due to foreign key constraints)
      await Purchaseitem.destroy({ where: { invoice } });

      await Purchase.destroy({ where: { invoice } });

      res.redirect('/purchases');
    } catch (error) {
      console.log(error);
      res.status(500).send('Gagal menghapus purchase');
    }
  });

  router.post('/delete/:id/item', checkLogin, async (req, res) => {
    const { id } = req.params;

    try {
      const itemToDelete = await Purchaseitem.findOne({ where: { id } });
      if (!itemToDelete) {
        return res.status(404).json({ error: 'Item tidak ditemukan' });
      }

      const invoice = itemToDelete.invoice;
      await Purchaseitem.destroy({ where: { id } });

      // Hitung ulang totalsum setelah hapus item
      const items = await Purchaseitem.findAll({ where: { invoice } });
      const totalsum = items.reduce((sum, item) => sum + Number(item.totalprice), 0);
      await Purchase.update({ totalsum }, { where: { invoice } });

      res.json({ success: true });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Gagal menghapus item' });
    }
  });

  return router;
}