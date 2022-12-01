'use strict';
const {
  Model
} = require('sequelize');
const Convert = require('../helpers/rupiah');
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {

    static associate(models) {
      Transaction.belongsTo(models.Product, {
        foreignKey: 'ProductId'
      });
      Transaction.belongsTo(models.User, {
        foreignKey: 'UserId'
      })
    }
  }
  Transaction.init({
    total_price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Total Price cannot be omitted",
        },
        notEmpty: {
          msg: "Total Price cannot be an empty string",
        },
        isNumeric: {
          msg: "Total Price format must be numeric"
        }
      },
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Price cannot be omitted",
        },
        notEmpty: {
          msg: "Price cannot be an empty string",
        },
        isNumeric: {
          msg: "Price format must be numeric"
        }
      },
    },
    ProductId: DataTypes.INTEGER,
    UserId: DataTypes.INTEGER
  }, {
    hooks: {
      afterCreate(transaction) {
        transaction.total_price = Convert(transaction.total_price);
      },
    },
    sequelize,
    modelName: 'Transaction',
  });
  return Transaction;
};