const nodemailer = require("nodemailer");
const sendMail = async (options) => {
    //1) create a transporter
    const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    });
    const message = {
        from: `Ha dep chai 002`,
        to: options.email,
        subject: options.subject,
        text: options.message
    };
    await transporter.sendMail(message);
}
module.exports = sendMail;