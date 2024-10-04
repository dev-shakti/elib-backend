import { Request, Response, NextFunction } from "express";

const createUser = (req: Request, res: Response, next: NextFunction) => {
  res.json({ msg: "User created successfully" });
};

export default createUser;
