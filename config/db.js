const mongoose = require('mongoose')
const app = require('express')();

// Make connection to Mongo DataBase
const connectDB = async () => {
    try {
        let mongoURI
        switch (app.get('env')){
            case ('development'):
                mongoURI = process.env.MONGO_URI_DEV;
                break;
            case ('production'):
                mongoURI = process.env.MONGO_URI_PROD;
                break;
            default:
                throw new Error(`Unknown execution environment: ${app.get('env')}`)
        }

        const conn = await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        })

        console.log(`MongoDB connected on ${conn.connection.host}:${conn.connection.port}`)
    } catch (error) {
        console.log('DB Server Error, please reload your page')
        process.exit()
    }
}

module.exports = connectDB