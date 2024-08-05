const mongoose = require('mongoose');

 const connecttoDb = async() =>{
    try {
        const connect = await mongoose.connect(process.env.MONGO_URI);
        console.log(
            "Database connected: ",
            connect.connection.host,
            connect.connection.name
        );
    } catch (error) {
        console.log(error);
    }
 };

 module.exports = connecttoDb;
