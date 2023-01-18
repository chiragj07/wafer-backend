const {Router} = require('express');
const router = Router()

const {loginUser,registerUser, verifyEmailOTP, verifyPhoneOTP, phoneOtpApi} = require('../controllers/userController')

router.post('/register',registerUser);
router.post('/login',loginUser);
router.post('/verify/email',verifyEmailOTP);
router.post('/verify/phone',verifyPhoneOTP);
router.post('/send-otp-phone',phoneOtpApi);



module.exports = router
