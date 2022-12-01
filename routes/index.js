const router = require("express").Router();

const usersRouter = require("./users-router");
const categoriesRouter = require('./categories-router');
const productsRouter = require('./products-router');
const errorMiddleware = require("./../middleware/error-middleware");
const authenticationMiddleware = require("./../middleware/authentication-middleware");
const transactionRouter = require("./transaction-routes")

router.use(usersRouter);
router.use(authenticationMiddleware);
router.use(categoriesRouter);
router.use(productsRouter);
router.use("/transactions", transactionRouter)

router.use((req, res, next) => {
	next({ name: "PageNotFound" });
});

router.use(errorMiddleware);

module.exports = router;
