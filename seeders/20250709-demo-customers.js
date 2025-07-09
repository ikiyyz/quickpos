'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('customers', [
      {
        name: 'Raka Pratama',
        address: 'Jl. Anggrek No. 1, Jakarta',
        phone: '0811111111',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Dina Putri',
        address: 'Jl. Melati No. 2, Bandung',
        phone: '0822222222',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Fajar Ramadhan',
        address: 'Jl. Kenanga No. 3, Surabaya',
        phone: '0833333333',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Salsa Aulia',
        address: 'Jl. Mawar No. 4, Yogyakarta',
        phone: '0844444444',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Gilang Saputra',
        address: 'Jl. Dahlia No. 5, Semarang',
        phone: '0855555555',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Vina Lestari',
        address: 'Jl. Flamboyan No. 6, Medan',
        phone: '0866666666',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('customers', null, {});
  }
}; 