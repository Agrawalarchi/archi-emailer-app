const {mailerFunction} = require("../Config/nodemailer.js");
const {techEmailTemplate} = require("../Utils/emailTemplate.js");
const emailModel = require("../Models/emailsModel.js");

require('dotenv').config();

const sendingEmail = async (req, res)=>{
    const {secretKey} = req.body;
    const existingEmails = await emailModel.find({});  
    const response = [];
    if(secretKey !== process.env.SECRETKEY){
        return res.status(401).json({status:false, message: "Unauthorized"});
    }
    if(!existingEmails || !Array.isArray(existingEmails) || existingEmails.length === 0){
        return res.status(400).json({status:false, message: "Invalid or empty emails array"});
    }
    for(let i=0; i<existingEmails.length; i++){
        try{
         await mailerFunction(existingEmails[i].email, "Regarding Internship/Full-Time Opportunity", techEmailTemplate());
         response.push(`Email sent for ${existingEmails[i].email}`);
        }
        catch(err){
            response.push(`Failed to send email for ${existingEmails[i].email}: ${err.message}`);
        }
    }
    await emailModel.deleteMany({});
    res.json({status:true, message: "Emails sent successfully", response});
}

const fillEntries = (req, res)=>{
    const {emails, secretKey} = req.body;  
    if(!emails || !Array.isArray(emails) || emails.length === 0){
        return res.status(400).json({status:false, message: "Invalid or empty emails array"});
    }   
    if(secretKey !== process.env.SECRETKEY){
        return res.status(401).json({status:false, message: "Unauthorized"});
    }
    const emailDocuments = emails.map(email => ({ email }));
    emailModel.insertMany(emailDocuments)
    .then(() => {
        res.json({status:true, message: "Entries added successfully"});
    })
    .catch((err) => {
        console.error("Error adding entries to database:", err);
        res.status(500).json({status:false, message: "Failed to add entries to database"});
    });
}

const getEnteries = async (req, res)=>{
    try{
        const existingEmails = await emailModel.find({});       
        res.json({status:true, body: existingEmails});
    }
    catch(err){
        console.error("Error fetching entries from database:", err);
        res.status(500).json({status:false, body: "Failed to fetch entries from database"});
    }   
}


module.exports = {sendingEmail, fillEntries, getEnteries};