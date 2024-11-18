const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');

const sendResume = class {
    // constructor
    constructor() { }
    async sendEmail(gmailUser, gmailPassword, filePath, emailOption) {
        if (!gmailUser || !gmailPassword) {
            throw new Error('Missing Gmail credentials. Please set GMAIL_USER and GMAIL_PASSWORD environment variables.');
        }
        // Create a transporter object using Gmail SMTP details
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false, // Use true for port 465 if required by your provider
            auth: {
                user: gmailUser,
                pass: gmailPassword
            }
        });
        // Define the path to your image attachment 
        const imagePath = filePath;
        try {
            // Read the image file asynchronously and create an attachment object
            const attachment = await this.readFileAsAttachment(imagePath);
            // Define email options with the attachment 
            const mailOptions = {
                from: emailOption.from, // Sender address
                bcc: emailOption.to, // List of recipients
                subject: emailOption.subject, // Subject line
                text: emailOption.text, // Plain text body
                attachments: [attachment]
            };
            // Send mail with defined transport object
            const info = await transporter.sendMail(mailOptions);
            console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
        } catch (error) {
            console.error('Error sending email:', error);
        }
    }

    // Function to read the image file asynchronously
    async readFileAsAttachment(filePath) {
        return new Promise((resolve, reject) => {
            fs.readFile(filePath, (err, data) => {
                if (err) {
                    reject(err);
                    return;
                }
                const attachment = {
                    filename: filePath, // Extract filename from path
                    content: data,
                    contentType: 'application/pdf' // Specify content type for image
                };
                resolve(attachment);
            });
        });
    }
};
module.exports = sendResume;
