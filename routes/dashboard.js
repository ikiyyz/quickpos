var express = require('express');
var router = express.Router();
const { checkLogin } = require('../helpers/utils');
const createCsvStringifier = require('csv-writer').createObjectCsvStringifier;
const { Sale, Purchase, sequelize } = require('../models');
const { Op } = require('sequelize');
const { formatCurrency } = require('../helpers/utils');
const moment = require('moment');

module.exports = function (db) {
  router.get('/', checkLogin, async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      let whereSale = {};
      let wherePurchase = {};
      if (startDate && endDate) {
        whereSale.time = wherePurchase.time = { [Op.between]: [startDate, endDate + ' 23:59:59'] };
      } else if (startDate) {
        whereSale.time = wherePurchase.time = { [Op.gte]: startDate };
      } else if (endDate) {
        whereSale.time = wherePurchase.time = { [Op.lte]: endDate + ' 23:59:59' };
      }

      // summary
      const [totalPurchase, totalSales, totalSalesCount] = await Promise.all([
        Purchase.sum('totalsum', { where: wherePurchase }) || 0,
        Sale.sum('totalsum', { where: whereSale }) || 0,
        Sale.count({ where: whereSale })
      ]);
      const earnings = (totalSales || 0) - (totalPurchase || 0);

      // earnings bulanan (line chart & tabel)
      const salesMonthly = await Sale.findAll({
        attributes: [
          [sequelize.fn('DATE_TRUNC', 'month', sequelize.col('time')), 'month'],
          [sequelize.fn('SUM', sequelize.col('totalsum')), 'revenue'],
          [sequelize.fn('COUNT', sequelize.col('invoice')), 'salesCount']
        ],
        where: whereSale,
        group: [sequelize.fn('DATE_TRUNC', 'month', sequelize.col('time'))],
        order: [[sequelize.fn('DATE_TRUNC', 'month', sequelize.col('time')), 'ASC']]
      });
      const purchaseMonthly = await Purchase.findAll({
        attributes: [
          [sequelize.fn('DATE_TRUNC', 'month', sequelize.col('time')), 'month'],
          [sequelize.fn('SUM', sequelize.col('totalsum')), 'expense']
        ],
        where: wherePurchase,
        group: [sequelize.fn('DATE_TRUNC', 'month', sequelize.col('time'))],
        order: [[sequelize.fn('DATE_TRUNC', 'month', sequelize.col('time')), 'ASC']]
      });

      const monthlyMap = {};
      for (const s of salesMonthly) {
        const key = moment(s.get('month')).format('YYYY-MM');
        monthlyMap[key] = {
          month: moment(s.get('month')).format('MMMM YYYY'),
          revenue: parseFloat(s.get('revenue')),
          salesCount: parseInt(s.get('salesCount')),
          expense: 0
        };
      }
      for (const p of purchaseMonthly) {
        const key = moment(p.get('month')).format('YYYY-MM');
        if (!monthlyMap[key]) {
          monthlyMap[key] = {
            month: moment(p.get('month')).format('MMMM YYYY'),
            revenue: 0,
            salesCount: 0,
            expense: parseFloat(p.get('expense'))
          };
        } else {
          monthlyMap[key].expense = parseFloat(p.get('expense'));
        }
      }

      const monthlyEarnings = Object.values(monthlyMap).map(row => ({
        ...row,
        earning: (row.revenue || 0) - (row.expense || 0)
      })).sort((a, b) => moment(a.month, 'MMMM YYYY').toDate() - moment(b.month, 'MMMM YYYY').toDate());

      const [directSales, customerSales] = await Promise.all([
        Sale.sum('totalsum', { where: { ...whereSale, customer: null } }) || 0,
        Sale.sum('totalsum', { where: { ...whereSale, customer: { [Op.ne]: null } } }) || 0
      ]);

      res.render('dashboard/index.ejs', {
        title: 'Dashboard',
        user: req.session.user,
        currentPath: req.path,
        summary: {
          totalPurchase,
          totalSales,
          earnings,
          totalSalesCount
        },
        monthlyEarnings,
        pieData: {
          direct: directSales,
          customer: customerSales
        },
        startDate,
        endDate,
        formatCurrency,
        currentPage: 'dashboard',
        messages: req.flash()
      });
    } catch (err) {
      req.flash('error', 'Error accessing dashboard: ' + err.message);
      res.redirect('/users');
    }
  });

  router.get('/download', checkLogin, async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      let whereSale = {};
      let wherePurchase = {};
      if (startDate && endDate) {
        whereSale.time = wherePurchase.time = { [Op.between]: [startDate, endDate + ' 23:59:59'] };
      } else if (startDate) {
        whereSale.time = wherePurchase.time = { [Op.gte]: startDate };
      } else if (endDate) {
        whereSale.time = wherePurchase.time = { [Op.lte]: endDate + ' 23:59:59' };
      }

      const salesMonthly = await Sale.findAll({
        attributes: [
          [sequelize.fn('DATE_TRUNC', 'month', sequelize.col('time')), 'month'],
          [sequelize.fn('SUM', sequelize.col('totalsum')), 'revenue'],
          [sequelize.fn('COUNT', sequelize.col('invoice')), 'salesCount']
        ],
        where: whereSale,
        group: [sequelize.fn('DATE_TRUNC', 'month', sequelize.col('time'))],
        order: [[sequelize.fn('DATE_TRUNC', 'month', sequelize.col('time')), 'ASC']]
      });
      const purchaseMonthly = await Purchase.findAll({
        attributes: [
          [sequelize.fn('DATE_TRUNC', 'month', sequelize.col('time')), 'month'],
          [sequelize.fn('SUM', sequelize.col('totalsum')), 'expense']
        ],
        where: wherePurchase,
        group: [sequelize.fn('DATE_TRUNC', 'month', sequelize.col('time'))],
        order: [[sequelize.fn('DATE_TRUNC', 'month', sequelize.col('time')), 'ASC']]
      });
      const moment = require('moment');
      const monthlyMap = {};
      for (const s of salesMonthly) {
        const key = moment(s.get('month')).format('YYYY-MM');
        monthlyMap[key] = {
          month: moment(s.get('month')).format('MMMM YYYY'),
          revenue: parseFloat(s.get('revenue')),
          salesCount: parseInt(s.get('salesCount')),
          expense: 0
        };
      }
      for (const p of purchaseMonthly) {
        const key = moment(p.get('month')).format('YYYY-MM');
        if (!monthlyMap[key]) {
          monthlyMap[key] = {
            month: moment(p.get('month')).format('MMMM YYYY'),
            revenue: 0,
            salesCount: 0,
            expense: parseFloat(p.get('expense'))
          };
        } else {
          monthlyMap[key].expense = parseFloat(p.get('expense'));
        }
      }
      const monthlyEarnings = Object.values(monthlyMap).map(row => ({
        ...row,
        earning: (row.revenue || 0) - (row.expense || 0)
      })).sort((a, b) => moment(a.month, 'MMMM YYYY').toDate() - moment(b.month, 'MMMM YYYY').toDate());

      // Generate CSV
      const csvStringifier = createCsvStringifier({
        header: [
          { id: 'month', title: 'Monthly' },
          { id: 'expense', title: 'Expense' },
          { id: 'revenue', title: 'Revenue' },
          { id: 'earning', title: 'Earning' }
        ]
      });
      const csv = csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(monthlyEarnings);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="report.csv"');
      res.send(csv);
    } catch (err) {
      res.status(500).send('Failed to generate CSV: ' + err.message);
    }
  });

  return router;
}