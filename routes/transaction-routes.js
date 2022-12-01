const TransactionController = require("../controllers/transaction-controller")

const router = require("express").Router()

router.get("/admin", TransactionController.findAll)

router.get("/user", TransactionController.findAllTransactionUser)

router.get("/:id", TransactionController.findOneTransaction)

router.post("/", TransactionController.create)

module.exports = router