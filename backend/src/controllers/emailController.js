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
            return res.status(200).send({ message: 'Email sent successfully' });
        } else {
            return res.status(500).send({ message: 'Email not sent' });
        }
    } catch (error) {
        return res.status(500).send(error.message);
    }
};

const sendOrderConfirmationEmail = async (orderDetails) => {
    try {
        const { customerName, customerEmail, customerPhone, orderNumber, totalPrice, adminOrderId } = orderDetails;
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

        // const productIds = cartData.map(item => item.productId);
        // // Fetch product details from the database for the product IDs in the cart
        // const products = await Products.find({ _id: { $in: productIds } });
        // const productDetails = products.map(product => `Product: ${product.name}, Quantity: ${product.quantity}, Price: ${product.price}`).join('\n');

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: customerEmail,
            subject: `Order Confirmation - Order #${orderNumber}`,
            text: `Hi ${customerName}!\n\nThank you for your order!\n\nOrder Number: ${orderNumber}\n\nTotal Price: ${totalPrice}\n\nWe will process your order soon.`,
        };

        const mailOptions2 = {
            from: process.env.EMAIL_USER,
            to: process.env.ADMIN_EMAIL,
            subject: `New order from ${customerName}`,
            text: `Name: ${customerName}\nEmail: ${customerEmail}\nPhone: ${customerPhone}\nOrderId for Admin: ${adminOrderId}\nTotal Price: ${totalPrice}`,
        };

        transport.sendMail(mailOptions2);

        const info = await transport.sendMail(mailOptions);
        if (info.accepted.length > 0) {
            console.log('Order confirmation email sent successfully');
        } else {
            console.log('Order confirmation email not sent');
        }
    } catch (error) {
        console.error('Error sending order confirmation email:', error);
    }
};

const sendOrderCancellationEmail = async (orderDetails) => {
    try {
        const { customerName, customerEmail, customerPhone, orderNumber, adminOrderId } = orderDetails;
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
            to: customerEmail,
            subject: `Order Cancellation - Order #${orderNumber}`,
            text: `Hi ${customerName}!\n\nWe regret to inform you that your order with Order Number ${orderNumber} has been requested for cancellation.\n\nOur team will reach you soon regarding product cancellation.\n\nIf you have any questions or concerns, please contact our customer support.`,
        };

        const mailOptions2 = {
            from: process.env.EMAIL_USER,
            to: process.env.ADMIN_EMAIL,
            subject: `Order Cancellation - Order #${orderNumber}`,
            text: `Order from ${customerName} with Order Number ${orderNumber} has been requested for cancellation.\n\nCustomer Email: ${customerEmail}\n\nCustomer Phone: ${customerPhone}\nAdmin Order ID: ${adminOrderId}`,
        };

        transport.sendMail(mailOptions2);

        const info = await transport.sendMail(mailOptions);
        if (info.accepted.length > 0) {
            console.log('Order cancellation email sent successfully');
        } else {
            console.log('Order cancellation email not sent');
        }
    } catch (error) {
        console.error('Error sending order cancellation email:', error);
    }
};

const sendVerificationEmail = async (email, verificationToken) => {
    const verificationLink = `${process.env.FRONTEND_URL}/verify?token=${verificationToken}`;

    const transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            type: 'OAuth2',
            user: process.env.EMAIL_USER,
            clientId: CLIENT_ID,
            clientSecret: CLIENT_SECRET,
            refreshToken: REFRESH_TOKEN,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Account Verification',
        text: `Click on the following link to verify your account: ${verificationLink}`,
        html: `<p><a href="${verificationLink}">Click here</a> to verify your account. This link will expire in an hour.</p>
        <p>If the link doesn't work, copy and paste the following link in your browser's address bar:</p>
        <p><a href="${verificationLink}">${verificationLink}</a></p>
        `,
    };

    await transport.sendMail(mailOptions);
};

const sendPasswordResetEmail = async (email, resetPasswordToken) => {
    const resetPasswordLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetPasswordToken}`;

    const transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            type: 'OAuth2',
            user: process.env.EMAIL_USER,
            clientId: CLIENT_ID,
            clientSecret: CLIENT_SECRET,
            refreshToken: REFRESH_TOKEN,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Password Reset',
        text: `Click on the following link to reset your password: ${resetPasswordLink}`,
        html: `<p>Hey there,</p><p>We received a request to reset your password. Click the following link to reset your password:</p><p><a href="${resetPasswordLink}">Reset Password</a></p><p>If you didn't request this, you can ignore this email. This link will expire in an hour.</p><p>
        <p>If the link doesn't work, copy and paste the following link in your browser's address bar:</p>
        <p><a href="${resetPasswordLink}">${resetPasswordLink}</a>
        </p>`,
    };

    await transport.sendMail(mailOptions);
}

module.exports = { sendEmail, sendOrderConfirmationEmail, sendOrderCancellationEmail, sendVerificationEmail, sendPasswordResetEmail };