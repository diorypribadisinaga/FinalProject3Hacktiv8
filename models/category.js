'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {

    static associate(models) {
      Category.hasMany(models.Product, {
        as: "Products",
        foreignKey: "CategoryId",
        onDelete: 'cascade',
        hooks: true
      });
    }
  }
  Category.init({
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Type cannot be omitted",
        },
        notEmpty: {
          msg: "Type cannot be an empty string",
        },
      },
    },
    sold_product_amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Sold product amount cannot be omitted",
        },
        notEmpty: {
          msg: "Sold product amount cannot be an empty string",
        },
        isNumeric: {
          msg: "Sold product amount format must be numeric"
        }
      },
    }
  }, {
    sequelize,
    modelName: 'Category',
  });
  return Category;
};