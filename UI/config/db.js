const mongoose = require('mongoose');
const config  =require('config')

//mongo uri from default.json file
const db = config.get('mongoURI')

const connectDB = async ()=>{

    try {

        await mongoose.connect(db,{
            useNewUrlParser:true,
            useCreateIndex : true ,useUnifiedTopology: true,
            useFindAndModify:false
        })
        console.log("mongoDB connected...")

    }
    catch(err){

        console.error(err.message)
        //exit  the application or process with faliure
        process.exit(1);

    }
}

module.exports = connectDB;