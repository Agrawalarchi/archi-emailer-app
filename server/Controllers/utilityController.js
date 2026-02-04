const {mailerFunction} = require("../Config/nodemailer.js");
const {techEmailTemplate} = require("../Utils/emailTemplate.js");
require('dotenv').config();

const sendingEmail = async (req, res)=>{
    const {emails, secretKey} = req.body;
    
    const response = [];
    if(secretKey !== process.env.SECRETKEY){
        return res.status(401).json({status:false, message: "Unauthorized"});
    }
    if(!emails || !Array.isArray(emails) || emails.length === 0){
        return res.status(400).json({status:false, message: "Invalid or empty emails array"});
    }
    for(let i=0; i<emails.length; i++){
        try{
         await mailerFunction(emails[i], "Regarding Internship Opportunity", techEmailTemplate());
         response.push(`Email sent for ${emails[i]}`);
        }
        catch(err){
            response.push(`Failed to send email for ${emails[i]}`);
        }
    }
    res.json({status:true, message: "Emails sent successfully", response});
}


module.exports = {sendingEmail};