import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import { User } from "./userModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "../config/config";

const createToken= (_id: string) => {
   // Check if the secret is available
  if (!config.secret) {
    throw new Error("JWT secret not found in config");
}    
 // Generate the token
     return jwt.sign({_id},config.secret, {expiresIn:"7d"})
}

const createUser = async(req: Request, res: Response, next: NextFunction) => {

 try {
  const {name, email, password}=req.body;

  //Validation
  if(!name || !email || !password){
    return next(createHttpError(400, 'All fields are required'));
  }
  //DB call
  const existingUser=await User.findOne({email})
  if(existingUser){
    return next(createHttpError(400, 'Email already exists'));
  }

  //Hashed the password for security
  const hashedPassword=await bcrypt.hash(password,10)

  //Create user in the database
  const user=await User.create({name,email, password:hashedPassword})

   // Generate a JWT token
  const token=createToken(user._id)

  // Respond with the user details and token
  res.status(201).json({ email, token});
 } catch (error) {
      next(error)
 }
};

const loginUser = async(req: Request, res: Response, next: NextFunction) => {
  res.json({})
}

export  {createUser,loginUser};
