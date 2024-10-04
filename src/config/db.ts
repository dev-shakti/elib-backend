import mongoose from "mongoose";
import { config } from "./config";


const connectDB = async() => {
    try {
        mongoose.connection.on("connected", () => {
            console.log("Connected to Databse successfully")
        })
        mongoose.connection.on("error", (err) => {
            console.log("Error in Connecting Database",err)
        })
        await mongoose.connect(config.databaseURL as string)
    } catch (error) {
        console.error("Failed to connect Database",error)
        process.exit(1)
    }
    
}

export default connectDB