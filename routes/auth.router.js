const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middleware/auth");
const { apiEnum } = require("../enum/api.enum");
const router = require("express").Router();
const upload = require("../common/uploadFile");
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

router.use(authMiddleware.protect);
   
router
    .put(
        apiEnum.API_UPDATE_PASSWORD,
        authController.updatePassword
    );
router
    .get(
        apiEnum.API_GET_MY_PROFILE,
        authController.getMe
    );
router
    .put(
        apiEnum.API_UPDATE_PROFILE,
        upload.uploadUserPhoto,
        authController.updateDetails
);
router
    .delete(
        apiEnum.API_DELETE_ME,
        authController.deleteMe
    );
module.exports = router;