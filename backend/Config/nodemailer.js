require('dotenv').config();

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure:true,
    auth:{
         user: process.env.SMTP_USER,
         pass: process.env.SMTP_PASS
    }
});

transporter.verify((err, success) => {
  if(err) {
    console.error("SMTP VERIFY FAILED");
    console.error(err);
  } else {
    console.log("SMTP READY");
  }
});



const mailerFunction = async (to, sub, msg)=>{
  try{
      await transporter.sendMail({
        from: `archiagrawal387@gmail.com`, 
        to:to,
        subject:sub,
        html:msg,
        attachments: [{
            filename: 'Archi_Agrawal_Cv.pdf',
            path:"./Archi_Agrawal_Cv.pdf"
        }]
      });
  }
  catch(err){
     console.log(err);
  }
}

module.exports = {mailerFunction};