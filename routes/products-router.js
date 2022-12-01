const ProductController = require('./../controllers/products-controllers');
const router = require("express").Router();

router.post("/products", ProductController.postProduct);
router.get("/products", ProductController.getProducts);
router.put("/products/:id", ProductController.updateProduct);
router.patch("/products/:id", ProductController.updateCategoryProduct);
router.delete("/products/:id", ProductController.deleteProduct);

module.exports = router;