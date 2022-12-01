const UsersController = require("./../controllers/users-controllers");
const router = require("express").Router();
const authenticationMiddleware = require("./../middleware/authentication-middleware");


router.post("/users/login", UsersController.signIn);
router.post("/users/register", UsersController.signUp);

router.put("/users", authenticationMiddleware, UsersController.updateUser);
router.delete("/users", authenticationMiddleware, UsersController.deleteUser);
router.patch("/users/topup", authenticationMiddleware, UsersController.topUp);

module.exports = router;
