const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Customer extends Model {
        static associate(models) {
            // define associations here jika diperlukan
        }
    }

    Customer.init({
        customerid: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        address: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        phone: {
            type: DataTypes.STRING(20),
            allowNull: true
        }
    }, {
        sequelize,
        modelName: 'Customer',
        tableName: 'customers',
        timestamps: true
    });

    return Customer;
}; 