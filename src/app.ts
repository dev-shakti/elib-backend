import express from "express";
import globalErrorHandlers from "./middlewares/globalErrorHandlers";
import userRouter from "./user/userRouter";
const app=express();

//Routes
app.get("/", (req,res,next) => {
    res.send("Welcome to elib books")
})
//middlewares
app.use(express.json())
app.use("/api/users", userRouter)

// Global error handlers
app.use(globalErrorHandlers)

export default app;