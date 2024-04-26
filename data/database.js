const mongoose = require('mongoose');

const dbName = 'mongodb://127.0.0.1:27017/plant-recognition';

mongoose.Promise = global.Promise

let connection;
mongoose.connect(dbName).then(result => {
    connection = result.connection;
    console.log("Connection to database successful")
}).catch(err => {
    console.log("Connection to database failed", err)
})
