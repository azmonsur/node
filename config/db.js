const mongoose = require('mongoose')

// Make connection to Mongo DataBase
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        })

        console.log(`MongoDB connected on ${conn.connection.host}:${conn.connection.port}`)
    } catch (error) {
        console.log('DB Server Error, please reload your page')
        process.exit('Opps! Server error')
    }
}

module.exports = connectDB