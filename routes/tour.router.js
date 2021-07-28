const router = require("express").Router();
const authMiddleware = require("../middleware/auth");
const authController = require("../controllers/auth.controller");
const TourController = require("../controllers/tour.controller");

router
    .route("/tours")
    .get(authMiddleware.protect, TourController.getAllTours)
    .post(authMiddleware.protect, TourController.createTour)
router
    .route("/:id")
    .get(TourController.getTour)
    .patch(TourController.updateTour)
    .delete(authMiddleware.protect, authController.restrictTo('admin', 'lead-guide'), TourController.deleteTour);
module.exports = router;