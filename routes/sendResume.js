




const express = require('express');
const multer = require('multer');
const fs = require('fs');
const csv = require('csv-parser');
const router = express.Router();
const fsExtra = require("fs-extra");
const uuidV4 = require("uuid4");
const path = require("path");
const SendResume = require("../services/sendResume.service.js");
const sendResumeObj = new SendResume();

router.post("/", function (req, res, next) {
    // Multer file storage configuration
    const storage = multer.diskStorage({
        // Set file storage path
        destination: function (req, file, callback) {
            fsExtra.mkdirsSync("./public/upload");
            callback(null, "./public/upload");
        },
        // Rename the file name using uuid
        filename: function (req, file, callback) {
            const imageName = uuidV4();
            callback(null, imageName + path.extname(file.originalname));
        }
    });
    // Multer file validation configuration
    const upload = multer({
        storage: storage,
        limits: {
            fileSize: 500 * 1024 * 1024
        },
        fileFilter: function (req, file, cb) {
            // Supported file types array
            const filetype = [".pdf"];
            // if file type is not from array it will return following error
            if (filetype.indexOf(path.extname(file.originalname).toLowerCase()) < 0) {
                return cb({ message: "File must be a PDF", code: "INVALID_FILE_TYPE" });
            }
            cb(null, true);
        }
    }).fields([{
        name: "attachments" // set name of attachments to accept from the req.files
    }]);
    // calling the upload function to upload images
    upload(req, res, async function (err) {
        if (err) {
            return res.status(400).send({ error: err }); // 400 Bad Request
        } else {
            try {
                // Check if req files are not set then return the error
                if (!req.files || Object.keys(req.files).length === 0) {
                    return res.status(400).send({ error: err }); // 400 Bad Request
                }
                let file = req.files;
                let fileType = "doc";
                let attachments;
                for (let attachment of req.files.attachments) {
                    attachments = attachment;
                }
                const to = req.body.emailList.split(",");
                const emailOption = {
                    from: req.body.senderName,
                    subject: req.body.subject,
                    text: req.body.mailText,
                    to: to
                }
                await sendResumeObj.sendEmail("ezysendresume@gmail.com", "qnbz gpdd bxjj qxxv", attachments.path, emailOption);
                res.status(200).json({
                    success: true,
                    message: 'Attachment sent successfully',
                    data: attachments
                });
            } catch (err) {
                console.log(err);
                return res.status(400).send({ error: err }); // 400 Bad Request
            }
        }
    });
});


module.exports = router;
