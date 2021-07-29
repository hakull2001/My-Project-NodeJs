const userController = require("../controllers/user.controller");
const authMiddleware = require("../middleware/auth");
const router = require("express").Router();
const { apiEnum } = require("../enum/api.enum");

router
    .get(apiEnum.API_GET_ALL_USERS, userController.getAllUsers);


module.exports = router;