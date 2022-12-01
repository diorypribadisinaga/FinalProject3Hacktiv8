'use strict';
const {
  Model
} = require('sequelize');
const Convert = require('../helpers/rupiah');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Product.belongsTo(models.Category, {
        foreignKey: 'CategoryId'
      });

      Product.hasMany(models.Transaction, {
        as: "Transaction",
        foreignKey: "ProductId",
        onDelete: 'cascade',
        hooks: true
      })
    }
  }
  Product.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Title cannot be omitted",
        },
        notEmpty: {
          msg: "Title cannot be an empty string",
        },
      },
    },
    price: {
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
        },
        min: {
          args: [0],
          msg: "Minimal price Rp 0"
        },
        max: {
          args: 50000000,
          msg: "Maksimal price Rp 50jt"
        },
      },
    },
    stock: {
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
        },
        // min: {
        //   args: [5],
        //   msg: "Minimal 5 stock"
        // }
      },
    },
    CategoryId: DataTypes.INTEGER
  }, {
    hooks: {
      afterCreate(product) {
        product.price = Convert(product.price);
      },
    },
    sequelize,
    modelName: 'Product',
  });
  return Product;
};