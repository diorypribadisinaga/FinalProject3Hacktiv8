const { User, Category, Product } = require("./../models/index");
const Convert = require("../helpers/rupiah")

class CategoryController {
    static async postCategory(req, res, next) {
        const userRole = req.user.role;
        try {
            const { type } = req.body;
            if (userRole !== "admin") throw { name: "not allowed" }
            const result = await Category.create({ type, sold_product_amount: 0 });
            res.status(201).json({ category: { id: result.id, type: result.type, updatedAt: result.updatedAt, createdAt: result.createdAt, sold_product_amount: result.sold_product_amount } });
        } catch (error) {
            next(error);
        }
    }

    static async getCategories(req, res, next) {
        const userRole = req.user.role
        try {
            if (userRole !== "admin") throw { name: "not allowed" }
            const result = await Category.findAll({ include: [{ model: Product, as: 'Products' }] });

            result.forEach(category => {
                category.Products.forEach(product => {
                    product.price = Convert(product.price)
                });
            });

            res.status(200).json({ categories: result });
        } catch (error) {
            next(error);
        }
    }

    static async updateCategory(req, res, next) {
        try {
            let { type = null } = req.body;
            const { id } = req.params;
            const userRole = req.user.role;

            const category = await Category.findOne({ where: { id } });

            if (!category) {
                throw { name: 'ErrNotFound' }
            } else if (userRole !== 'admin') {
                throw { name: "not allowed" }
            } else if (type === null) {
                type = category.type;
            }

            const result = await Category.update({ type, updatedAt: new Date() },
                { where: { id }, returning: true });

            res.status(200).json(result[1]);
        } catch (err) {
            next(err)
        }
    }

    static async deleteCategory(req, res, next) {
        try {
            const { id } = req.params;
            const userRole = req.user.role;

            const category = await Category.findOne({ where: { id } });

            if (!category) {
                throw { name: 'ErrNotFound' }
            } else if (userRole !== 'admin') {
                throw { name: "not allowed" }
            }

            await Category.destroy(
                { where: { id } }
            )

            res.status(200).json({ message: "Category has been successfully deleted" })
        } catch (err) {
            next(err)
        }
    }
}

module.exports = CategoryController;
