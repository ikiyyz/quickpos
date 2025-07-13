const { DataTypes, Sequelize } = require('sequelize');

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.createTable('sales', {
      invoice: {
        type: DataTypes.STRING(20),
        primaryKey: true,
        allowNull: false
      },
      time: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: Sequelize.fn('NOW')
      },
      totalsum: {
        type: DataTypes.DECIMAL(19,2),
        allowNull: true
      },
      pay: {
        type: DataTypes.DECIMAL(19,2),
        allowNull: true
      },
      change: {
        type: DataTypes.DECIMAL(19,2),
        allowNull: true
      },
      customer: {
        type: DataTypes.INTEGER,
        references: { model: 'customers', key: 'customerid' },
        allowNull: true
      },
      operator: {
        type: DataTypes.INTEGER,
        references: { model: 'users', key: 'id' },
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: Sequelize.fn('NOW')
      }
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('sales');
  }
}; 