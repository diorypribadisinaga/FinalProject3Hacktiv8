const Convert = require("../helpers/rupiah")
const { Product, User, Transaction, Category } = require("../models")

class TransactionController {
  static async create(req, res, next) {
    const { ProductId, quantity } = req.body

    try {
      const user = await User.findOne({ where: { id: req.user.id } })
      const checkProduct = await Product.findOne({ where: { id: ProductId } })
      if (!checkProduct) throw { name: "Not Found Product" }

      if (quantity > checkProduct.stock) throw { name: "out of stock" }
      const total_price = quantity * checkProduct.price

      if (total_price > user.balance) throw { name: "Your money is not enough" }
      const category = await Category.findOne({ where: { id: checkProduct.CategoryId } })
      const sold_product_amount = quantity + category.sold_product_amount

      const sisaStok = checkProduct.stock - quantity
      await Product.update({
        stock: sisaStok, updatedAt: new Date()
      }, { where: { id: ProductId } })

      await User.update({ balance: (user.balance - total_price), updatedAt: new Date() }, { where: { id: user.id } })

      await Category.update({
        sold_product_amount, updatedAt: new Date()
      }, { where: { id: category.id } })

      await Transaction.create({ total_price, ProductId, UserId: user.id, quantity })
      res.json({
        message: "You have successfully purchase the product", transactionBill: {
          total_price: Convert(total_price), quantity, product_name: checkProduct.title
        }
      })
    } catch (error) {
      next(error)
    }
  }


  static async findAllTransactionUser(req, res, next) {
    const user = req.user
    try {
      const Transactions = await Transaction.findAll({ include: [{ model: Product, as: "Product" }], where: { UserId: user.id } })

      Transactions.forEach(tr => {
        tr.total_price = Convert(tr.total_price)
        tr.Product.price = Convert(tr.Product.price)
      });

      res.send({ transactionHistories: Transactions })
    } catch (error) {
      next(error)
    }
  }

  static async findAll(req, res, next) {
    const roleUser = req.user.role
    try {
      if (roleUser !== "admin") throw { name: "not allowed" }
      const Transactions = await Transaction.findAll({ include: [{ model: Product, as: "Product" }, { model: User, as: "User" }] })

      Transactions.forEach(tr => {
        tr.total_price = Convert(tr.total_price)
        tr.Product.price = Convert(tr.Product.price)
      });

      res.send({ transactionHistories: Transactions })
    } catch (error) {
      next(error)
    }
  }

  static async findOneTransaction(req, res, next) {
    const { id } = req.params
    const roleUser = req.user.role
    try {
      const transaction = await Transaction.findOne({ include: [{ model: Product, as: "Product" }], where: { id } })

      if (!transaction) throw { name: "ErrNotFound" }

      transaction.total_price = Convert(transaction.total_price)
      transaction.Product.price = Convert(transaction.Product.price)

      if (roleUser !== "admin" && req.user.id !== transaction.UserId) throw { name: "not allowed" }
      res.send(transaction)
    } catch (error) {
      next(error)
    }
  }
}


module.exports = TransactionController