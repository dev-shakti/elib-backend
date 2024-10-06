import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import { User } from "./userModel";

const createUser = async(req: Request, res: Response, next: NextFunction) => {

  const {name, email, password}=req.body;

  //validation
  if(!name || !email || !password){
    next(createHttpError(400, 'All fields are required'));
  }
  //db call
  const newUser=await User.find({email})
  if(newUser){
    next(createHttpError(400, 'Email already exists'));
  }
  
  res.json({ msg: "User created successfully" });
};

export default createUser;
