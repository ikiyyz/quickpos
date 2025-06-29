const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.createTable('units', {
      unit: {
        type: DataTypes.STRING(10),
        primaryKey: true,
        allowNull: false
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      note: {
        type: DataTypes.TEXT,
        allowNull: true
      }
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('units');
  }
};
