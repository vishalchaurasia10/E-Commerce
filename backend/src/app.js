const connectToMongo = require('./db');
const express = require('express')
var cors = require('cors')
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' })

connectToMongo();

const app = express()
const port = process.env.PORT || 8000

app.use(cors())
app.use(express.json())
app.use('/uploads', express.static('uploads'));
app.use('/api/categories', require('./routes/categoryRoutes'));
// app.use('/api/banners', require('./routes/bannerRoutes'));
// app.use('/api/announcements', require('./routes/announcementRoutes'));
// app.use('/api/featuredproducts', require('./routes/featuredProductsRoutes'));
app.use('/api/products', require('./routes/productsRoutes'));

app.listen(port, () => {
    console.log(`The Daily Scoop listening on port ${port}`)
})