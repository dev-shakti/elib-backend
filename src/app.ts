import express from "express";
import globalErrorHandlers from "./middlewares/globalErrorHandlers";
const app=express();

//Routes
app.get("/", (req,res,next) => {
    res.send("Welcome to elib books")
})

// Global error handlers
app.use(globalErrorHandlers)

export default app;