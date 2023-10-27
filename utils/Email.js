const nodemailer = require('nodemailer')


const sendEmail = async(mainInfo)=>{
    // 1- Create transporter (is a service to send email like => gmail , mailGun , mailtrap)
    const transporter = nodemailer.createTransport({
        host : process.env.EMAIL_HOST,
        port : process.env.EMAIL_PORT ,
        secure : process.env.EMAIL_SECURE,
        auth:{
            user : process.env.EMAIL_USER,
            pass : process.env.EMAIL_PASS
        }
    })
    // 2- define email options (from , to , subject , content...)
    const mailOptions = {
        from : '"E-commerce" <mayadamohamedfathy206@gmail.com>',
        to : mainInfo.email,
        subject : mainInfo.subject ,
        text : mainInfo.message
    }
    // 3- Send email
    await transporter.sendMail(mailOptions)
}

module.exports = sendEmail;