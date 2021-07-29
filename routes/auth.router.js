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
    
router
    .put(
        apiEnum.API_UPDATE_PASSWORD,
        authMiddleware.protect,
        authController.updatePassword
    );
router
    .get(
        apiEnum.API_GET_MY_PROFILE,
        authMiddleware.protect,
        authController.getMe
    );
router
    .put(
        apiEnum.API_UPDATE_PROFILE,
        authMiddleware.protect,
        authController.updateDetails
);
router
    .delete(
        apiEnum.API_DELETE_ME,
        authMiddleware.protect,
        authController.deleteMe
    );
module.exports = router;