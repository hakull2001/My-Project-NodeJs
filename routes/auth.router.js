const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middleware/auth");
const { apiEnum } = require("../enum/api.enum");
const router = require("express").Router();
router
    .post(apiEnum.API_SIGNUP, authController.signUp)
    .post(apiEnum.API_LOGIN, authController.login)

router
    .post(
        apiEnum.API_GET_TOKEN,
        authMiddleware.veryRefreshToken,
        authController.getToken
);
router
    .post(apiEnum.API_FORGOT_PASSWORD, authController.forgotPassword)
    .patch(apiEnum.API_RESET_PASSWORD, authController.resetPassword);

module.exports = router;