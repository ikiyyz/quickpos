const express = require('express');
const { checkLogin } = require('../helpers/utils');
const router = express.Router();
const { Customer } = require('../models');

module.exports = function (db) {
    router.get('/', checkLogin, async (req, res) => {
        try {
            const customers = await Customer.findAll({
                attributes: ['customerid', 'name', 'address', 'phone']
            });
            res.render('customer/list.ejs', {
                title: 'Customers',
                customers,
                currentPage: 'customers',
                user: req.session.user,
                messages: req.flash()
            });
        } catch (error) {
            console.error(error);
            req.flash('error', 'Error fetching customers');
            res.redirect('/customers');
        }
    });

    router.get('/add', checkLogin, (req, res) => {
        res.render('customer/form.ejs', {
            title: 'Add New Customer',
            customer: null,
            currentPage: 'customers',
            user: req.session.user,
            messages: req.flash()
        });
    });

    router.get('/edit/:id', checkLogin, async (req, res) => {
        try {
            const customer = await Customer.findByPk(req.params.id);
            if (!customer) {
                req.flash('error', 'Customer not found');
                res.redirect('/customers');
                return;
            }
            res.render('customer/form.ejs', {
                title: 'Edit Customer',
                customer,
                currentPage: 'customers',
                user: req.session.user,
                messages: req.flash()
            });
        } catch (error) {
            console.error(error);
            req.flash('error', 'Error fetching customer');
            res.redirect('/customers');
        }
    });

    router.post('/add', checkLogin, async (req, res) => {
        try {
            const { name, address, phone } = req.body;
            await Customer.create({ name, address, phone });
            req.flash('success', 'Customer created successfully');
            res.redirect('/customers');
        } catch (error) {
            console.error(error);
            req.flash('error', 'Error creating customer');
            res.redirect('/customers/add');
        }
    });

    router.post('/edit/:id', checkLogin, async (req, res) => {
        try {
            const { name, address, phone } = req.body;
            const customer = await Customer.findByPk(req.params.id);
            if (!customer) {
                req.flash('error', 'Customer not found');
                res.redirect('/customers');
                return;
            }
            await customer.update({ name, address, phone });
            req.flash('success', 'Customer updated successfully');
            res.redirect('/customers');
        } catch (error) {
            console.error(error);
            req.flash('error', 'Error updating customer');
            res.redirect(`/customers/edit/${req.params.id}`);
        }
    });

    router.post('/delete/:id', checkLogin, async (req, res) => {
        try {
            await Customer.destroy({ where: { customerid: req.params.id } });
            req.flash('success', 'Customer deleted successfully');
            res.redirect('/customers');
        } catch (error) {
            console.error(error);
            req.flash('error', 'Error deleting customer');
            res.redirect('/customers');
        }
    });

    return router;
};