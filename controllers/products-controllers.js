const Convert = require("../helpers/rupiah");
const { Product, Category } = require("./../models/index");


class ProductController {
    static async postProduct(req, res, next) {
        const userRole = req.user.role;
        try {
            if (userRole !== "admin") throw { name: "not allowed" }
            const { title, price, stock, CategoryId } = req.body;
            const checkCategory = await Category.findOne({ where: { id: CategoryId } })
            if (!checkCategory) throw { name: "category not found" }
            if (stock < 5) throw { name: "minimal 5 stock" }
            const result = await Product.create({ title, price, stock, CategoryId });
            res.status(201).json({
                category: {
                    title: result.title,
                    price: result.price,
                    stock: result.stock,
                    CategoryId: result.CategoryId,
                    createdAt: result.createdAt,
                    updatedAt: result.updatedAt,
                }
            });
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    static async getProducts(req, res, next) {
        const userRole = req.user.role;
        try {
            if (userRole !== "admin") throw { name: "not allowed" }
            const result = await Product.findAll({ order: [['id', 'ASC']] });

            result.forEach(product => {
                product.price = Convert(product.price)
            });

            res.status(200).json({ products: result });
        } catch (error) {
            next(error);
        }
    }

    static async updateProduct(req, res, next) {
        try {
            let { title = null, price = null, stock = null } = req.body;
            const { id } = req.params;
            const userRole = req.user.role;

            const product = await Product.findOne({ where: { id } });

            if (!product) {
                throw { name: 'ErrNotFound' }
            } else if (userRole !== 'admin') {
                throw { name: "not allowed" }
            }
            if (title === null) {
                title = product.title;
            }
            if (price === null) {
                price = product.price;
            }
            if (stock === null) {
                stock = product.stock;
            }

            const result = await Product.update({ title, price, stock, updatedAt: new Date() },
                { where: { id }, returning: true });

            result[1][0].price = Convert(result[1][0].price)

            res.status(200).json(result[1]);
        } catch (err) {
            next(err)
        }
    }

    static async updateCategoryProduct(req, res, next) {
        try {
            let { CategoryId = null } = req.body;
            const { id } = req.params;
            const userRole = req.user.role;

            const product = await Product.findOne({ where: { id } });

            if (!product) {
                throw { name: 'ErrNotFound' }
            } else if (userRole !== 'admin') {
                throw { name: "not allowed" }
            } else if (CategoryId === null) {
                CategoryId = product.CategoryId;
            }
            const checkCategory = await Category.findOne({ where: { id: CategoryId } })
            if (!checkCategory) throw { name: "category not found" }

            const result = await Product.update({ CategoryId, updatedAt: new Date() },
                { where: { id }, returning: true });

            result[1][0].price = Convert(result[1][0].price)

            res.status(200).json(result[1]);
        } catch (err) {
            next(err)
        }
    }

    static async deleteProduct(req, res, next) {
        try {
            const { id } = req.params;
            const userRole = req.user.role;

            const category = await Product.findOne({ where: { id } });

            if (!category) {
                throw { name: 'ErrNotFound' }
            } else if (userRole !== 'admin') {
                throw { name: "not allowed" }
            }

            await Product.destroy(
                { where: { id } }
            )

            res.status(200).json({ message: "Product has been successfully deleted" })
        } catch (err) {
            next(err)
        }
    }
}

module.exports = ProductController;
