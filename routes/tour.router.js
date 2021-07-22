const router = require("express").Router();
const TourController = require("../controllers/tour.controller");

router
    .route("/tours")
    .get(TourController.getAllTours)
    .post(TourController.createTour)
router
    .route("/:id")
    .get(TourController.getTour)
    .patch(TourController.updateTour)
    .delete(TourController.deleteTour)
module.exports = router;