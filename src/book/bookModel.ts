import mongoose from "mongoose";
import { BookTypes } from "./bookTypes";

//Book Schema
const bookSchema=new mongoose.Schema<BookTypes>({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        require: true,
    },
    author: {
        type: String,
        required: true,
    },
    coverImage: {
        type: String,
        required: true,
    },
    file: {
        type: String,
        requied: true,
    },
    genre: {
        type: String,
        required: true,
    },
},{timestamps:true})

//Book Model
const Book=mongoose.model<BookTypes>('Book',bookSchema);
export default Book;