'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     */
    await queryInterface.bulkInsert('suppliers', [
      {
        name: 'Pak Budi',
        address: 'Jl. Sudirman No. 123, Jakarta Pusat',
        phone: '021-5550123'
      },
      {
        name: 'Pak Joko',
        address: 'Jl. Thamrin No. 45, Jakarta Selatan',
        phone: '021-5550456'
      },
      {
        name: 'Pak Slamet',
        address: 'Jl. Gatot Subroto No. 67, Jakarta Barat',
        phone: '021-5550789'
      },
      {
        name: 'Pak Dedi',
        address: 'Jl. Hayam Wuruk No. 89, Jakarta Utara',
        phone: '021-5550321'
      },
      {
        name: 'Pak Agus',
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