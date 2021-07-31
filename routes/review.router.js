const Router = require("express").Router({mergeParams : true});
const reviewController = require("../controllers/review.controller");
const authController = require("../controllers/auth.controller");
const { apiEnum } = require("../enum/api.enum");
const authMiddleware = require("../middleware/auth");

Router
    .route("/")
    .get(reviewController.getAllReviews)
    .post(
        authMiddleware.protect,
        authController.restrictTo("user"),
        reviewController.setTourUserId,
        reviewController.createReview
    );
Router
    .route("/reviews/:id")
    .get(reviewController.getReview)
    .put(
        authController.restrictTo("user", "admin"),
        reviewController.updateReview
    )
    .delete(
        authController.restrictTo("user", "admin"),
        reviewController.deleteReview
    )
module.exports = Router;

