// require('dotenv').config({path: './env'})
import dns from "node:dns" // insted of using the dns server provided by windows or my network, use these public DNS servers to resolve domain names
import dotenv from 'dotenv';
import connectDB from './db/index.js';

 dns.setServers(['1.1.1.1', '8.8.8.8']) // 1.1.1.1 = cloudfare DNS, 8.8.8.8 = Google DNS
dotenv.config({
    path: './env'
});
connectDB()
.then(()=>{
    app.on("error", (error) => {
        console.error("Error: ", error);
        throw error;
    });

    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server is running on port ${process.env.PORT || 8000}`);
    });
})
.catch((error)=>{
    console.log("Error in connecting to DB !!!", error)
})



/*
import mongoose from 'mongoose';
import { DB_NAME } from './constants';

import express from 'express';
const app = express();

(async () => {
    try{
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on("error", () => {
            console.error("Error: ", error)
            throw error
        })

        app.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}`)
        });
    } catch(error){
        console.error("Error: ", error)
        throw error
    }
})()

*/