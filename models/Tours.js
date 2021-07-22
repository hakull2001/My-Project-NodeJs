const mongoose = require("mongoose");
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
        }
    });
module.exports = mongoose.model("tours", TourSchema);
