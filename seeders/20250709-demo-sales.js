module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('sales', [
      {
        invoice: 'INV-PENJ20250710-1', // 10 Juli 2025
        time: '2025-07-10 10:00:00',
        totalsum: 120000,
        pay: 120000,
        change: 0,
        customer: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        invoice: 'INV-PENJ20250815-1', // 15 Agustus 2025
        time: '2025-08-15 11:00:00', 
        totalsum: 170000,
        pay: 170000,
        change: 0,
        customer: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        invoice: 'INV-PENJ20250905-1', // 5 September 2025
        time: '2025-09-05 09:00:00',
        totalsum: 250000,
        pay: 250000,
        change: 0,
        customer: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('sales', null, {});
  }
}; 