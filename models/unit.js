const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Unit extends Model {
    static associate(models) {
      // define associations here
    }
  }

  Unit.init({
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
  }, {
    sequelize,
    modelName: 'Unit',
    tableName: 'units',
    timestamps: false
  });

  return Unit;
};
