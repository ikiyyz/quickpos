const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Purchaseitem extends Model {
    static associate(models) {
      Purchaseitem.belongsTo(models.Purchase, { 
        foreignKey: 'invoice', 
        onDelete: 'CASCADE', 
        onUpdate: 'CASCADE' 
      });
      Purchaseitem.belongsTo(models.Goods, { 
        foreignKey: 'itemcode', 
        onDelete: 'CASCADE', 
        onUpdate: 'CASCADE'  
      });
    }
  }

  Purchaseitem.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    invoice: DataTypes.STRING(20),
    itemcode: DataTypes.STRING(50),
    quantity: DataTypes.INTEGER,
    purchaseprice: DataTypes.DECIMAL(19, 2),
    totalprice: DataTypes.DECIMAL(19, 2)
  }, {
    sequelize,
    modelName: 'Purchaseitem',
    tableName: 'purchaseitems',
    timestamps: true
  });

  return Purchaseitem;
}; 