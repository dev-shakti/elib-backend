import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import { User } from "./userModel";
import bcrypt from "bcrypt";

const createUser = async(req: Request, res: Response, next: NextFunction) => {

  const {name, email, password}=req.body;

  //validation
  if(!name || !email || !password){
    return next(createHttpError(400, 'All fields are required'));
  }
  //db call
  const newUser=await User.findOne({email})
  if(newUser){
    return next(createHttpError(400, 'Email already exists'));
  }
  const hashedPassword=await bcrypt.hash(password,10)
  const user=await User.create({name,email, password:hashedPassword})
  res.json({ });
};

export default createUser;
