const mongoose = require("mongoose");
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
ReviewSchema.pre(/^find/, function (next) {
    this.populate({
        path: "user",
        select : "name photo"
    })
    next();
})
module.exports = mongoose.model("reviews", ReviewSchema);