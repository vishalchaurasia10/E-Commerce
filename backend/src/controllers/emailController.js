const nodemailer = require('nodemailer');
const { google } = require('googleapis');

const CLIENT_ID = process.env.EMAIL_CLIENT_ID;
const CLIENT_SECRET = process.env.EMAIL_CLIENT_SECRET;
const REDIRECT_URI = process.env.EMAIL_REDIRECT_URI;
const REFRESH_TOKEN = process.env.EMAIL_REFRESH_TOKEN;

const oAuth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const sendEmail = async (req, res) => {
    try {
        const { name, email, phone, message } = req.body;
        const accessToken = await oAuth2Client.getAccessToken();

        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: process.env.EMAIL_USER,
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Thank you for contacting us! We'll get back to you soon.",
            text: `Hi ${name}!. We have received your message. We will contact you as soon as possible.`,
        };

        const mailOptions2 = {
            from: process.env.EMAIL_USER,
            to: process.env.ADMIN_EMAIL,
            subject: `New message from ${name}`,
            text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nMessage: ${message}`,
        };

        transport.sendMail(mailOptions2);

        const info = await transport.sendMail(mailOptions);
        if (info.accepted.length > 0) {
            console.log('Email sent successfully');
            return res.status(200).send({ message: 'Email sent successfully' });
        } else {
            console.log('Email not sent');
            return res.status(500).send({ message: 'Email not sent' });
        }
    } catch (error) {
        return res.status(500).send(error.message);
    }
};

module.exports = { sendEmail };