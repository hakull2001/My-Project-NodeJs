const mongoose = require("mongoose");
const slugify = require("slugify");
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
            required :[true, "Chuyến tham quan phải có thời hạn"]
        },
        maxGroupSize: {
            type: Number,
            required : [true, "Chuyến tham quan phải có nhóm"]
        },
        difficulty: {
            type: String,
            required : [true, "Chuyến tham quan phải có độ khó"]
        },
        slug : String,
        priceDiscount: Number,
        summery: {
            type: String,
            trim : true
        },
        description: {
            type: String,
            trim: true,
            required : [true, "Chuyến tham quan phải có mô tả"]
        },
        imageCover: {
            type: String,
            required : [true, "Chuyến tham quan phải có ảnh chụp lại"]
        },
        image: [String],
        createdAt: {
            type: Date,
            default: Date.now(),
            select: false
        },
        startDates : [Date]
    });
TourSchema.pre("save", function (next) {
    this.slug = slugify(this.name, { lower: true });
    next();
})
module.exports = mongoose.model("tours", TourSchema);
