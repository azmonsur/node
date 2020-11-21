const mongoose = require('mongoose');
const app = require('express')();

module.exports = async () => {
    let MONGO_URI
    try {
        switch (app.get('env')) {
            case ('production'):
                MONGO_URI = MGPROD;
                break;
            case ('development'):
                MONGO_URI = MGDEV;
                break;
            default:
                throw new Error('Unkown execution environment ' + app.get('env'))
        }

        let conn = await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        });

    } catch (error) {
        console.log('DB Server error, please try again');
        process.exit()
    }
}