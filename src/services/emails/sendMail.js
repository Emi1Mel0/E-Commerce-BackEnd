// import nodemailer from "nodemailer";
// import { emailTemplate } from "./emailtemplate.js";
// import jwt from "jsonwebtoken";
// import { catchError } from "../middleware/errorcatcher.js";

// export const sendMail = async (email) => {
//   const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       user: process.env.EMAIL_NAME,
//       pass: process.env.EMAIL_PASSWORD,
//     },
//   });

//   const token = jwt.sign({ email }, process.env.JWT_KEY );

//   const info = await transporter.sendMail({
//     from: `"ME10 ☯"<${process.env.EMAIL_NAME}> `, // sender address
//     to: email, // list of receivers
//     subject: "Hello ✔", // Subject line
//     html: emailTemplate(token), // html body
//   });
//   console.log("Message sent: %s", info.messageId);
// };

// // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

// //
// // NOTE: You can go to https://forwardemail.net/my-account/emails to see your email delivery status and preview
// //       Or you can use the "preview-email" npm package to preview emails locally in browsers and iOS Simulator
// //       <https://github.com/forwardemail/preview-email>
// //

// // };

// // async..await is not allowed in global scope, must use a wrapper
// // async function main() {
// // send mail with defined transport object
