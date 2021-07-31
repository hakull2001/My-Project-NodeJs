const mongoose = require("mongoose");
const slugify = require("slugify");
//const User = require("./Users");
const TourSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Tên chuyến đi là bắt buộc"],
            unique: [true, "Tên chuyến đi đã tồn tại"]
        },
        rating: {
            type: Number,
            default: 4.5,
        },
        price: {
            type: Number,
            required: [true, "Giá chuyến đi không được để trống"],
        },
        durations: {
            type: Number,
            required: [true, "Chuyến tham quan phải có thời hạn"]
        },
        maxGroupSize: {
            type: Number,
            required: [true, "Chuyến tham quan phải có nhóm"]
        },
        difficulty: {
            type: String,
            required: [true, "Chuyến tham quan phải có độ khó"]
        },
        slug: String,
        priceDiscount: Number,
        summery: {
            type: String,
            trim: true
        },
        description: {
            type: String,
            trim: true,
            required: [true, "Chuyến tham quan phải có mô tả"]
        },
        imageCover: {
            type: String,
            required: [true, "Chuyến tham quan phải có ảnh chụp lại"]
        },
        image: [String],
        createdAt: {
            type: Date,
            default: Date.now(),
            select: false
        },
        startDates: [Date],
        guides: [
            {
                type: mongoose.Schema.ObjectId,
                ref: "users"
            }
        ]
    },
    {
        toJSON: { virtuals: true },
        toObject : {virtuals : true}
});
TourSchema.pre("save", function (next) {
    this.slug = slugify(this.name, { lower: true });
    next();
})
TourSchema.pre(/^find/, function (next) {
    this.populate({
            path: "guides",
            select : "-__v -passwordChangedAt -password -passwordResetExpires -passwordResetToken"
    });
    next();
})
TourSchema.virtual('reviews', {
    ref: "reviews",
    foreignField: "tour",
    localField: "_id"
})
// TourSchema.pre("save",async function (next) {
//     const promiseGuides = this.guides.map(async id => await User.findById(id));
//     this.guides = await Promise.all(promiseGuides);
//     next();
// }) 
module.exports = mongoose.model("tours", TourSchema);
