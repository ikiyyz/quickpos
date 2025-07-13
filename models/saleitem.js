const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Saleitem extends Model {
    static associate(models) {
      Saleitem.belongsTo(models.Sale, {
        foreignKey: 'invoice',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
      Saleitem.belongsTo(models.Goods, {
        foreignKey: 'itemcode',
        targetKey: 'barcode',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
    }
  }

  Saleitem.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    invoice: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    itemcode: {
      type: DataTypes.STRING(50),
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
    }
  }, {
    sequelize,
    modelName: 'Saleitem',
    tableName: 'saleitems',
    timestamps: true
  });

  return Saleitem;
}; 