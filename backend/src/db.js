const mongoose = require('mongoose');
require('dotenv').config();

let mongooseURI;

if (process.env.NODE_ENV === 'production') {
    mongooseURI = process.env.MONGO_URI;
} else {
    mongooseURI = process.env.MONGO_URI_DEV;
}

mongoose.set('strictQuery', true)

const connectToMongo = () => {
    mongoose.connect(mongooseURI)
    console.log('connected to mongoDB')
}

module.exports = connectToMongo