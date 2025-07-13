const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Sale extends Model {
    static associate(models) {
      Sale.hasMany(models.Saleitem, {
        foreignKey: 'invoice',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
      Sale.belongsTo(models.Customer, {
        foreignKey: 'customer',
        targetKey: 'customerid',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
      });
      Sale.belongsTo(models.User, {
        foreignKey: 'operator',
        targetKey: 'id',
        as: 'operatorUser',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
      });
    }
  }

  Sale.init({
    invoice: {
      type: DataTypes.STRING(20),
      primaryKey: true,
      allowNull: false
    },
    time: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW
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
      allowNull: true,
      references: {
        model: 'customers',
        key: 'customerid'
      }
    },
    operator: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'Sale',
    tableName: 'sales',
    timestamps: true
  });

  return Sale;
}; 