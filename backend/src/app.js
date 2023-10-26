const connectToMongo = require('./db');
const express = require('express')
var cors = require('cors')
const dotenv = require('dotenv');
const session = require('express-session');
const passport = require('./middlewares/passportConfig');

dotenv.config({ path: './config.env' })

connectToMongo();

const app = express()
app.use(session({ secret: 'your-secret-key', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
const port = process.env.PORT || 8000

app.use(cors())
app.use(express.json())
app.use('/uploads', express.static('uploads'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/users', require('./routes/authenticationRoutes'));
// app.use('/api/banners', require('./routes/bannerRoutes'));
// app.use('/api/announcements', require('./routes/announcementRoutes'));
// app.use('/api/featuredproducts', require('./routes/featuredProductsRoutes'));
app.use('/api/products', require('./routes/productsRoutes'));

app.listen(port, () => {
    console.log(`Backend listening on port ${port}`)
})