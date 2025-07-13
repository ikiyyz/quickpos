const { DataTypes, Sequelize } = require('sequelize');

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.createTable('saleitems', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      invoice: {
        type: DataTypes.STRING(20),
        references: { model: 'sales', key: 'invoice' },
        allowNull: false
      },
      itemcode: {
        type: DataTypes.STRING(50),
        references: { model: 'goods', key: 'barcode' },
        allowNull: false
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      sellingprice: {
        type: DataTypes.DECIMAL(19,2),
        allowNull: false
      },
      totalprice: {
        type: DataTypes.DECIMAL(19,2),
        allowNull: false
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
    await queryInterface.dropTable('saleitems');
  }
}; 