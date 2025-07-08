'use strict';

const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Purchase extends Model {
    static associate(models) {
      Purchase.hasMany(models.Purchaseitem, {
        foreignKey: 'invoice',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
      Purchase.belongsTo(models.Supplier, {
        foreignKey: 'supplier',
        targetKey: 'supplierid',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
      Purchase.belongsTo(models.User, {
        foreignKey: 'operator',
        as: 'operatorUser',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
    }
  }

  Purchase.init({
    invoice: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.STRING(20)
    },
    time: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    totalsum: {
      type: DataTypes.DECIMAL(19, 2),
      allowNull: false
    },
    supplier: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'suppliers',
        key: 'supplierid'
      }
    },
    operator: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'Purchase',
    tableName: 'purchases',
    timestamps: true
  });
  return Purchase;
}; 