const connectToMongo = require('./db');
const express = require('express')
var cors = require('cors')
const dotenv = require('dotenv');
const session = require('express-session');
const { default: mongoose } = require('mongoose');

dotenv.config({ path: './config.env' })

connectToMongo();

const db = mongoose.connection;
db.collection('products').createIndex({
    title: 'text',
    description: 'text',
    // Add more fields as needed
}, (error) => {
    if (error) {
        console.error('Error creating text index:', error);
    } else {
        console.log('Compound text index created successfully.');
    }
});

const app = express()
app.use(session({ secret: 'your-secret-key', resave: false, saveUninitialized: false }));
const port = process.env.PORT || 8000

app.use(cors())
app.use(express.json())
app.use('/uploads', express.static('uploads'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/users', require('./routes/authenticationRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/promocodes', require('./routes/promocodeRoutes'));
app.use('/api/shipping', require('./routes/shippingPriceRoutes'));
app.use('/webhooks', require('./routes/shiprocketWebhookRoutes'));
app.use('/api/sendemail', require('./routes/emailRoutes'));
// app.use('/api/banners', require('./routes/bannerRoutes'));
// app.use('/api/announcements', require('./routes/announcementRoutes'));
// app.use('/api/featuredproducts', require('./routes/featuredProductsRoutes'));
app.use('/api/products', require('./routes/productsRoutes'));

app.listen(port, () => {
    console.log(`Backend listening on port ${port}`)
})