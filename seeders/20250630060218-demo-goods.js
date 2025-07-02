'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     */
    await queryInterface.bulkInsert('goods', [
      {
        barcode: 'BRG001',
        name: 'Nasi Goreng',
        stock: 50,
        purchaseprice: 15000,
        sellingprice: 25000,
        unit: 'pcs',
        picture: null
      },
      {
        barcode: 'BRG002',
        name: 'Mie Goreng',
        stock: 30,
        purchaseprice: 12000,
        sellingprice: 20000,
        unit: 'pcs',
        picture: null
      },
      {
        barcode: 'BRG003',
        name: 'Es Teh Manis',
        stock: 100,
        purchaseprice: 3000,
        sellingprice: 5000,
        unit: 'pcs',
        picture: null
      },
      {
        barcode: 'BRG004',
        name: 'Kopi Hitam',
        stock: 75,
        purchaseprice: 8000,
        sellingprice: 12000,
        unit: 'pcs',
        picture: null
      },
      {
        barcode: 'BRG005',
        name: 'Kentang Goreng',
        stock: 25,
        purchaseprice: 18000,
        sellingprice: 28000,
        unit: 'pcs',
        picture: null
      },
      {
        barcode: 'BRG006',
        name: 'Ayam Goreng',
        stock: 20,
        purchaseprice: 25000,
        sellingprice: 35000,
        unit: 'pcs',
        picture: null
      },
      {
        barcode: 'BRG007',
        name: 'Es Jeruk',
        stock: 60,
        purchaseprice: 4000,
        sellingprice: 7000,
        unit: 'pcs',
        picture: null
      },
      {
        barcode: 'BRG008',
        name: 'Sate Ayam',
        stock: 15,
        purchaseprice: 30000,
        sellingprice: 45000,
        unit: 'pcs',
        picture: null
      },
      {
        barcode: 'BRG009',
        name: 'Bakso',
        stock: 40,
        purchaseprice: 20000,
        sellingprice: 30000,
        unit: 'pcs',
        picture: null
      },
      {
        barcode: 'BRG010',
        name: 'Es Campur',
        stock: 35,
        purchaseprice: 15000,
        sellingprice: 25000,
        unit: 'pcs',
        picture: null
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     */
    await queryInterface.bulkDelete('goods', null, {});
  }
};
