const {mailerFunction} = require("../Config/nodemailer.js");
const {techEmailTemplate} = require("../Utils/emailTemplate.js");
const emailModel = require("../Models/emailsModel.js");

require('dotenv').config();

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const sendingEmail = async (req, res) => {
    const { secretKey } = req.body;

    if (secretKey !== process.env.SECRETKEY) {
        return res.status(401).json({ status: false, message: "Unauthorized" });
    }

    const existingEmails = await emailModel.find({});

    if (!existingEmails || !Array.isArray(existingEmails) || existingEmails.length === 0) {
        return res.status(400).json({ status: false, message: "Invalid or empty emails array" });
    }
    res.json({ status: true, message: `Email job started for ${existingEmails.length} emails. Check server logs.` });

    const response = [];
    const BATCH_SIZE = 5;          // ✅ Smaller batches
    const DELAY_BETWEEN_EMAILS = 3000;   // ✅ 3s between each individual email
    const DELAY_BETWEEN_BATCHES = 60000; // ✅ 1 min between batches

    console.log(`Sending ${existingEmails.length} emails...`);

    for (let i = 0; i < existingEmails.length; i += BATCH_SIZE) {
        const batch = existingEmails.slice(i, i + BATCH_SIZE);
        const batchNumber = Math.floor(i / BATCH_SIZE) + 1;
        const totalBatches = Math.ceil(existingEmails.length / BATCH_SIZE);

        console.log(`\nBatch ${batchNumber}/${totalBatches}`);

        // ✅ Send one by one within each batch (sequential, not parallel)
        for (const item of batch) {
            try {
                await mailerFunction(
                    item.email,
                    "Regarding Internship/Full-Time Opportunity",
                    techEmailTemplate()
                );
                response.push(`Sent: ${item.email}`);
                console.log(`[PASS] ${item.email}`);
            } catch (err) {
                const errorMsg = err.message || err;
                response.push(`Failed: ${item.email} — ${errorMsg}`);
                console.error(`[FAIL] ${item.email}: ${errorMsg}`);
            }

            // ✅ Delay between every individual email
            await delay(DELAY_BETWEEN_EMAILS);
            await emailModel.deleteOne({email: item.email});

        }

        // ✅ Longer pause between batches
        if (i + BATCH_SIZE < existingEmails.length) {
            console.log(`Batch ${batchNumber} done. Waiting 60s before next batch...`);
            await delay(DELAY_BETWEEN_BATCHES);
        }
    }
};


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