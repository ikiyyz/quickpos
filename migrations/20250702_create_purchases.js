const { DataTypes, Sequelize } = require('sequelize');

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.createTable('purchases', {
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
      supplier: {
        type: DataTypes.INTEGER,
        references: { model: 'suppliers', key: 'supplierid' },
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
    await queryInterface.dropTable('purchases');
  }
}; 