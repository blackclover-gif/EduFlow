const express = require('express');

const router = express.Router();

const {
register,
verifyEmail,
resendOTP,
login,
forgotPassword,
verifyResetOTP,
resetPassword,
} = require('../controllers/authController');

router.post('/login', async (req, res) => {

    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        return res.status(404).json({
            message: "User not found"
        });
    }

    if (!user.isVerified) {
        return res.status(400).json({
            message: "Verify email first"
        });
    }

    res.json({
        message: "Login successful"
    });
});

router.post('/register',register);

router.post('/verify-email',verifyEmail);

router.post('/resend-otp',resendOTP);

router.post('/login',login);

router.post('/forgot-password',forgotPassword);

router.post('/verify-reset-otp',verifyResetOTP);

router.post('/reset-password',resetPassword);

module.exports = router;