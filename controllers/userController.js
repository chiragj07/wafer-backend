const User = require('../db/models/user')
const EmailOTP = require('../db/models/EmailOTP')
const PhoneOTP = require('../db/models/PhoneOTP')

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

const nodemailer = require('nodemailer');

function generateOtp(){
    let otp = '';
    for(let i=0; i<4;i++){
        let num = Math.floor(Math.random()*10);
        otp = `${otp}${num}`;
    }


    return otp;
}


async function sendOTPToPhone(phone,message){
    let otp = generateOtp();
    let isSaveOtp = false;
    if(!message){
        isSaveOtp = true;
        message = `Hello, welcome to our website, It is for your verification. you OTP is ${otp}`;
    }
    console.log(phone)
    let phoneNumber= phone.split(' ').join('');
    console.log(phoneNumber,phone)
    try{
      const res = await client.messages
            .create({
            body: message,
            from: '+12184232537',
            to: phoneNumber
        })

    if(!isSaveOtp) return;

    await PhoneOTP.query().insert({
        phone,
        otp
    })

    }
   catch (err){
        console.log(err)
   }
}

async function sendOTPtoEmail(email,message){

    let otp = generateOtp();
    let isSaveOtp = false;

    if(!message){
        isSaveOtp = true;
        message = `Hello, welcome to our website, It is for your verification. you OTP is ${otp}`;

    }

    const transporter = nodemailer.createTransport({
        host:"smtp.gmail.com",
        port:587,
        secure:false,
        auth:{
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }
    })


      var mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: 'Verification OTP',
        text: message
    };
    try{
    const res = await transporter.sendMail(mailOptions)

    // console.log(res)
    if(!isSaveOtp) return;
    const emailOtp = await EmailOTP.query().insert({
        email,
        otp
    })
    }
    catch(e){
        console.log(e.message)
    }
}

async function registerUser(req,res){
        console.log("hello")
        const newUser = req.body
        try{


        const user = await User.query().insert(newUser)

        const message = "Hello Thanks for registering with us"

        await sendOTPtoEmail(newUser.email,message);
        await sendOTPToPhone(newUser.phone, message);

        res.status(200).json({message:"user created"})
        }
        catch(er){
            let message = er.message;
            if(er.message.includes('duplicate key')){
                message = "User with this email or phone is already exist"
            }
            res.status(401).json({message:message})
        }

}

function isOTPExpired(obj){
    const diff= new Date()- new Date(obj.updated_at)
    var diffMins = Math.round(((diff % 86400000) % 3600000) / 60000)
    console.log(diffMins)
    if(diffMins >= 10){
        return true;
    }
    return false
}

async function loginUser(req,res){
    console.log("hello")
    const {email} = req.body;
    try{
        const user = await User.query().findOne({
            email
        })
        if(!user){
            throw new Error('No user found');
        }
        const phoneNumber = user.phone;
        const isEmailOtp = await EmailOTP.query().findOne({email})
        if(isEmailOtp){
            await EmailOTP.query().delete().where('email', email);
        }
        

        
        await sendOTPtoEmail(email);
        

        res.status(200).json({message:"otp has been sent to phone", user})

    }
    catch(e){
        console.log(e)
        res.status(500).json({message:"Some interna error"})
    }
}


async function phoneOtpApi(req,res){
        const {phone} = req.body;
        try{
        const isPhoneOtp = await PhoneOTP.query().findOne({phone: phone});

            // await sendOTPtoSMS(phone);
            if(isPhoneOtp){
                await PhoneOTP.query().delete().where('phone',phone);
            }
            
            await sendOTPToPhone(phone)
            res.status(200).json({message:"otp sent to phone"})
        }
        catch(err){
            console.log(err)
            res.status(500).json({message:"Some interna error"})

        }
}

function checkOtp(obj, otp){
    
    if(isOTPExpired(obj)){
        return {status:false, message:"expired"}
    }
    if(obj.otp === otp){
       return {status:true, message:"verified"};
    }
    else{
        return {status:false, message:"invalid otp"}
    }
}



async function verifyEmailOTP(req,res){
    const {email,otp} = req.body;
    try{
        const emailOtp = await EmailOTP.query().findOne({email});

        const result = checkOtp(emailOtp,otp);
        if(result.status){

            await EmailOTP.query().delete().where('email', email)
            


            res.status(200).json({message:"Email verification successfull"})

        }
        else{
            if(result.message === 'expired') await EmailOTP.query().delete().where('email', email)
            res.status(401).json({message:result.message})
        }
    }catch(e){
        res.status(400).json({message:e.message})
    }
}


async function verifyPhoneOTP(req,res){
    const {phone,otp} = req.body;
    try{
        const phoneOtp = await PhoneOTP.query().findOne({phone});

        const result = checkOtp(phoneOtp,otp);
        if(result.status){

            await PhoneOTP.query().delete().where('phone', phone)

            res.status(200).json({message:"verification successfull"})

        }
        else{
            if(result.message === 'expired') await PhoneOTP.query().delete().where('phone', phone)
            res.status(401).json({message:result.message})
        }
    }catch(e){
        res.status(400).json({message:e.message})
    }
}


module.exports = {loginUser,registerUser, verifyEmailOTP, verifyPhoneOTP,phoneOtpApi}