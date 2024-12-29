const mongoose = require("mongoose")
require("dotenv").config()

const mongoUrl = process.env.MONGODBURI

const initializeDatabase = async () => {
    try{
        const connection = mongoose.connect(mongoUrl)
        if(connection){
            console.log("Database connected successfully!")
        }
    }catch(error){
        console.log("Can't connect to the database : ",error)
    }
}

module.exports = {initializeDatabase}

