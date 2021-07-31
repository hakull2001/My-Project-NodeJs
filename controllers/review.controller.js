const Review = require("../models/Reviews");
const factory = require("./handleFactory");
module.exports = {
    getAllReviews: factory.getAllDocument(Review),
    createReview: factory.createDocument(Review),
    getReview:    factory.getDocument(Review),
    updateReview: factory.updateDocument(Review),
    deleteReview: factory.deleteDocument(Review),
    setTourUserId: (req, res, next) => {
        if (!req.body.tour) req.body.tour = req.params.tourId;
        if (!req.body.user) req.body.user = req.user.id;
        next();
    },
}