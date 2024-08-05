const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail', // or use 'smtp' if not using Gmail
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendActivationEmail = async (email, token) => {
    const url = `http://localhost:3000/activate/${token}`;
    await transporter.sendMail({
        to: email,
        subject: 'Account Activation',
        html: `<h4>Click the link to activate your account: <a href="${url}">Activate Account</a></h4>`,
    });
};

const sendResetPasswordEmail = async (email, token) => {
    const url = `http://localhost:3000/reset-password/${token}`;
    await transporter.sendMail({
        to: email,
        subject: 'Reset Password',
        html: `<h4>Click the link to reset your password: <a href="${url}">Reset Password</a></h4>`,
    });
};

module.exports = {
    sendActivationEmail,
    sendResetPasswordEmail,
};
