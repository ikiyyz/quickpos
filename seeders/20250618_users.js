const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Hash the default password
    const password = bcrypt.hashSync('password123', 10);

    // Create default admin user
    await queryInterface.bulkInsert('users', [
      {
        email: 'admin@pos.com',
        name: 'Admin User',
        password,
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        email: 'operator@pos.com',
        name: 'Operator User',
        password,
        role: 'operator',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', null, {});
  }
};
