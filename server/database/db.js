const mongoose = require("mongoose")
require("dotenv").config()

const mongoUrl = process.env.MONGODBURI

const initializeDatabase = async () => {
    try{
        const connection = mongoose.connect(mongoUrl, {
            useNewUrlParser : true,
            useUnifiedTopology : true
        })
        if(connection){
            console.log("Database connected successfully!")
        }
    }catch(error){
        console.log("Can't connect to the database : ",error)
    }
}

module.exports = {initializeDatabase}