import { UserTypes } from "../user/userTypes";

export interface BookTypes{
    _id: string;
  title: string;
  description: string;
  author: UserTypes;
  genre: string;
  coverImage: string;
  file: string;
  createdAt: Date;
  updatedAt: Date;
}