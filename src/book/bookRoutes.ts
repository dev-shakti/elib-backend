import express from "express";



const bookRouter=express.Router()

bookRouter.post("/books", createBook)

export default bookRouter