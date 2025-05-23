import nodemailer from 'nodemailer';
var transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_ADDR,
        pass: process.env.GOOGLE_APP_KEY
    }
})
/**
 * @typedef {{from: {String}, to: {String}, subject: {String}, text: {String}}} MailDetails
 */


/**
 * @type {MailDetails}
 */
export default async (mail_details) => {
    try {
        await transport.sendMail(mail_details);
    } catch (err) {
        console.log(err);
    }
}