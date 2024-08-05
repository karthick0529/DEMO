const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { sendActivationEmail, sendResetPasswordEmail } = require('../config/email');

exports.register = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        const user = await User.create({ firstName, lastName, email, password });
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        await sendActivationEmail(user.email, token);
        res.status(201).json({ message: 'User registered. Activation email sent.' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.activateAccount = async (req, res) => {
    try {
        const { token } = req.params;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) throw new Error('User not found');
        user.isActive = true;
        await user.save();
        res.status(200).json({ message: 'Account activated.' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !user.isActive || !(await bcrypt.compare(password, user.password))) {
            throw new Error('Invalid credentials or inactive account');
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.status(200).json({ token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) throw new Error('User not found');
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        await sendResetPasswordEmail(user.email, token);
        res.status(200).json({ message: 'Reset password email sent.' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) throw new Error('User not found');
        user.password = newPassword;
        await user.save();
        res.status(200).json({ message: 'Password reset successfully.' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
