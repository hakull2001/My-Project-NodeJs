const mongoose = require("mongoose");
const Tour = require("./Tours");
const ReviewSchema = new mongoose.Schema({
    review: {
        type: String,
        required: [true, "Phản hồi không được để trống"]
    },
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    tour: {
        type: mongoose.Schema.ObjectId,
        ref: "tours",
        required: [true, "Phản hồi phải thuộc về một chuyến đi"]
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "users",
        required: [true, "Phản hồi phải thuộc về một người dùng"]
    }

}, {
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
});
ReviewSchema.index({ tour: 1, user: 1 }, { unique: true });
ReviewSchema.pre(/^find/, function (next) {
    this.populate({
        path: "user",
        select : "name photo"
    })
    next();
})
ReviewSchema.statics.calcAverageRatings = async function (tourId) {
    const stats = await this.aggregate([
        {
            $match: { tour: tourId }
        },
        {
            $group: {
                _id: "$tour", 
                nRating: { $sum: 1 },
                avgRating: { $avg: "$rating" }
            }
        }]
    );
    if (stats.length > 0) {
        await Tour.findByIdAndUpdate(tourId, {
        ratingQuality: stats[0].nRating,
        ratingAverage: stats[0].avgRating
    });
    } else {
        await Tour.findByIdAndUpdate(tourId, {
        ratingQuality: 0,
        ratingAverage: 4.5
    });
    }
};
ReviewSchema.post("save", function (next) {
    this.constructor.calcAverageRatings(this.tour);
    next();
})
ReviewSchema.pre(/^findOneAnd/, async function (next) {
    this.r = await this.findOne();
    next();
})
ReviewSchema.post(/^findOneAnd/, async function () {
    await this.r.constructor.calcAverageRatings(this.r.tour);
});
module.exports = mongoose.model("reviews", ReviewSchema);