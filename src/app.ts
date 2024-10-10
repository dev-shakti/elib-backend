import express from "express";
import cors from "cors"
import globalErrorHandlers from "./middlewares/globalErrorHandlers";
import userRouter from "./user/userRouter";
import bookRouter from "./book/bookRoutes";
import { config } from "./config/config";
const app=express();


//middlewares
app.use(express.json())
app.use(cors({
    origin:config.frontendDomain
}))

//Routes
app.get("/", (req,res) => {
    res.send("Welcome to elib books")
})
app.use("/api/users", userRouter)
app.use('/api/books',bookRouter)

// Global error handlers
app.use(globalErrorHandlers)

export default app;