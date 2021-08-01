const userController = require("../controllers/user.controller");
const authMiddleware = require("../middleware/auth");
const authController = require("../controllers/auth.controller");
const router = require("express").Router();
const { apiEnum } = require("../enum/api.enum");
router.use(authMiddleware.protect);
router
    .route(apiEnum.API_GET_ALL_USERS)
    .get(userController.getAllUsers)
    .post(userController.createUser)
router
    .route(apiEnum.API_GET_USER)
    .get(userController.getUser)
    .put(userController.updateUser)
    .delete(userController.deleteUser);

module.exports = router;