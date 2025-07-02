const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Goods extends Model {
    static associate(models) {
      // Define relationship with Unit model
      Goods.belongsTo(models.Unit, {
        foreignKey: 'unit',
        as: 'unitData'
      });
    }
  }

  Goods.init({
    barcode: {
      type: DataTypes.STRING(20),
      primaryKey: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    purchaseprice: {
      type: DataTypes.DECIMAL(19, 2),
      allowNull: false
    },
    sellingprice: {
      type: DataTypes.DECIMAL(19, 2),
      allowNull: false
    },
    unit: {
      type: DataTypes.STRING(10),
      allowNull: false,
      references: {
        model: 'units',
        key: 'unit'
      }
    },
    picture: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Goods',
    tableName: 'goods',
    timestamps: false
  });

  return Goods;
};
