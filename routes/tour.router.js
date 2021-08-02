const router = require("express").Router();
const authMiddleware = require("../middleware/auth");
const authController = require("../controllers/auth.controller");
const TourController = require("../controllers/tour.controller");
const reviewRouter = require("./review.router");
const { apiEnum } = require("../enum/api.enum");
router
    .route(apiEnum.API_TOUR)
    .get(
        authMiddleware.protect,
        TourController.getTour
    )
    .put(
        authMiddleware.protect,
        authController.restrictTo("admin", "lead-guide"),
        TourController.updateTour)
    .delete(
        authMiddleware.protect,
        authController.restrictTo("admin", "lead-guide"),
        TourController.deleteTour
    );
router
    .route("/auth/tours")
    .get(authMiddleware.protect, TourController.getAllTours)
    .post(
        authMiddleware.protect,
        authController.restrictTo("admin", "lead-guide"),
        TourController.createTour
    );


router.use(apiEnum.API_CREATE_REVIEWS_INSIDE_ROUTER, reviewRouter);
    


module.exports = router;