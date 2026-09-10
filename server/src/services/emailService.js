// const nodemailer = require('nodemailer');

// const sendOTP = async (email, otp) => {
//     // Transporter setup (Abhi hum "Mailtrap" ya "Gmail" use kar sakte hain)
//     const transporter = nodemailer.createTransport({
//         service: 'gmail',
//         auth: {
//             user: process.env.EMAIL_USER, // Aapka email
//             pass: process.env.EMAIL_PASS  // Aapka App Password
//         }
//     });

//     const mailOptions = {
//         from: '"Ecommerce App" <noreply@ecommerce.com>',
//         to: email,
//         subject: 'Email Verification OTP',
//         text: `Aapka verification code hai: ${otp}. Ye 10 minutes mein expire ho jayega.`
//     };

//     await transporter.sendMail(mailOptions);
// };

// module.exports = { sendOTP };

// =======================================================

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: false,

    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});

const sendOTP = async (email, otp) => {
    await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: email,
        subject: "Your OTP Verification Code",

        text: `Your OTP is ${otp}. It will expire in 10 minutes.`,
    });
};

module.exports = {
    sendOTP,
};