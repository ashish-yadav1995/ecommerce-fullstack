const nodemailer = require('nodemailer');

const sendOTP = async (email, otp) => {
    // Transporter setup (Abhi hum "Mailtrap" ya "Gmail" use kar sakte hain)
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER, // Aapka email
            pass: process.env.EMAIL_PASS  // Aapka App Password
        }
    });

    const mailOptions = {
        from: '"Ecommerce App" <noreply@ecommerce.com>',
        to: email,
        subject: 'Email Verification OTP',
        text: `Aapka verification code hai: ${otp}. Ye 10 minutes mein expire ho jayega.`
    };

    await transporter.sendMail(mailOptions);
};

module.exports = { sendOTP };