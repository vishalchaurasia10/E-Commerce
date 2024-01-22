const nodemailer = require('nodemailer');

// Create a transporter with your SMTP settings
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});

// Previous shortened HTML template
const emailTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Confirmation</title>
    <style>
        /* Add your custom styles here */
    </style>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #e7e7e7; color: #000000;">

    <div style="padding: 20px; background-color: #ffffff; max-width: 500px; margin: 20px auto;">
        <h1 style="font-size: 22px; margin-bottom: 10px;">Hi {{name}},</h1>
        <p style="font-size: 16px;">Thank you for contacting us. We will get back to you as soon as possible.</p>
        <p style="font-size: 16px;">Here is a copy of your message: {{message}}</p>
        <p style="font-size: 16px;">Your Phone Number: {{phonenumber}}</p>
        <p style="font-size: 16px;">Regards,</p>
        <p style="font-size: 16px;">Team Forever TrendIn</p>
    </div>

</body>
</html>

`;

// Function to send an email
const sendEmail = async (req, res) => {
    try {
        const { name, email, phone, message } = req.body;

        // Replace html variable with the emailTemplate
        const html = emailTemplate.replace('{{name}}', name)
            .replace('{{phonenumber}}', phone)
            .replace('{{message}}', message);

        // Configure mail options
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Confirmation! Your message has been received',
            html: html,
        };

        // Send the email
        const info = await transporter.sendMail(mailOptions);
        if (!info.accepted) {
            res.status(200).json({ message: 'Email sent successfully' });
        } else if (info.rejected) {
            res.status(400).json({ message: 'Email rejected' });
        }
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ message: 'Error sending email' });
    }
};

module.exports = { sendEmail };