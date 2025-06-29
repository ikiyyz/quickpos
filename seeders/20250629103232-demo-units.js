'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     */
    await queryInterface.bulkInsert('units', [
      {
        unit: 'pcs',
        name: 'Pieces',
        note: 'Unit for individual items'
      },
      {
        unit: 'kg',
        name: 'Kilogram',
        note: 'Unit for weight measurement'
      },
      {
        unit: 'ltr',
        name: 'Liter',
        note: 'Unit for liquid measurement'
      },
      {
        unit: 'doz',
        name: 'Dozen',
        note: 'Unit for 12 pieces'
      },
      {
        unit: 'box',
        name: 'Box',
        note: 'Unit for packed items'
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     */
    await queryInterface.bulkDelete('units', null, {});
  }
};
