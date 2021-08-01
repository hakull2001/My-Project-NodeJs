const fs = require("fs");
const dotenv = require("dotenv");
const Tour = require("./models/Tours");
const Review = require("./models/Reviews");
const User = require("./models/Users");
dotenv.config({ path: "./config/config.env" });
require("./config/database")();
const tours = JSON.parse(fs.readFileSync(`${__dirname}/data/tours.json`, "utf-8"));
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/data/reviews.json`, "utf-8"));
const users = JSON.parse(fs.readFileSync(`${__dirname}/data/users.json`, "utf-8"));

const importData = async () => {
    try {
        await Tour.create(tours);
        await Review.create(reviews);
        await User.create(users, {validateBeforeSave : false});
        console.log("Dữ liệu đã được thêm thành công !");
    } catch (error) {
        console.log(error);
    }
    process.exit();
}
const deleteData = async () => {
      try {
          await Tour.deleteMany();
          await Review.deleteMany();
          await User.deleteMany();
        console.log("Dữ liệu đã được xóa thành công !");
    } catch (error) {
        console.log(error);
    }
    process.exit();
}
if (process.argv[2] === "--import") {
    importData();
} else if (process.argv[2] === "--delete") {
    deleteData();
}