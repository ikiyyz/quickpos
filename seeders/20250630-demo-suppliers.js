'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     */
    await queryInterface.bulkInsert('suppliers', [
      {
        name: 'PT Sukses Makmur',
        address: 'Jl. Sudirman No. 123, Jakarta Pusat',
        phone: '021-5550123'
      },
      {
        name: 'CV Maju Bersama',
        address: 'Jl. Thamrin No. 45, Jakarta Selatan',
        phone: '021-5550456'
      },
      {
        name: 'UD Berkah Jaya',
        address: 'Jl. Gatot Subroto No. 67, Jakarta Barat',
        phone: '021-5550789'
      },
      {
        name: 'PT Indah Sejahtera',
        address: 'Jl. Hayam Wuruk No. 89, Jakarta Utara',
        phone: '021-5550321'
      },
      {
        name: 'CV Makmur Abadi',
        address: 'Jl. Asia Afrika No. 12, Bandung',
        phone: '022-5550654'
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     */
    await queryInterface.bulkDelete('suppliers', null, {});
  }
}; 