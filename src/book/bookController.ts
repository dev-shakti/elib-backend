import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import cloudinary from "../config/cloudinary";
import path from "path";
import fs from "fs";
import Book from "./bookModel";
import { AuthRequest } from "../middlewares/authenticate";

const createBook = async (req: Request, res: Response, next: NextFunction) => {
  const { title, genre, description } = req.body;

  const files = req.files as { [fieldname: string]: Express.Multer.File[] };

  // Check if files exist
  if (!files.coverImage || !files.file) {
    return next(
      createHttpError(400, "Cover image and book file are required.")
    );
  }

  const coverImageMimeType = files.coverImage[0].mimetype.split("/").at(-1);
  const coverImageFileName = files.coverImage[0].filename;
  const coverImageFilePath = path.resolve(
    __dirname,
    "../public/data/uploads",
    coverImageFileName
  );

  const bookFileName = files.file[0].filename;
  const bookFilePath = path.resolve(
    __dirname,
    "../public/data/uploads",
    bookFileName
  );

  try {
    //upload cover image to cloudinary
    const uploadResult = await cloudinary.uploader.upload(coverImageFilePath, {
      filename_override: coverImageFileName,
      folder: "book-covers",
      format: coverImageMimeType,
    });

    //upload pdfs to cloudinary
    const uploadBookFileResult = await cloudinary.uploader.upload(
      bookFilePath,
      {
        resource_type: "raw",
        filename_override: bookFileName,
        folder: "book-pdfs",
        format: "pdf",
      }
    );

    // Create book in the database
    const _req = req as AuthRequest;
    const newBook = await Book.create({
      title,
      genre,
      description,
      author: _req.userId,
      coverImage: uploadResult.secure_url,
      file: uploadBookFileResult.secure_url,
    });
    res.status(201).json({ id: newBook._id });

    //remove local files from public/data/uploads
    await fs.promises.unlink(coverImageFilePath);
    await fs.promises.unlink(bookFilePath);
  } catch (error) {
    console.error(error);
    return next(createHttpError(500, "An unexpected error occurred."));
  }
};

//update book
const updateBook = async (req: Request, res: Response, next: NextFunction) => {
  const { title, description, genre } = req.body;
  const bookId = req.params.bookId;

  try {
    //find book by ID
    const book = await Book.findOne({ _id: bookId });
    if (!book) {
      return next(createHttpError(404, "Book not found"));
    }

    // Check if the user is authorized to update the book
    const _req = req as AuthRequest;
    if (book.author.toString() !== _req.userId) {
      return next(createHttpError(403, "You can not update others book."));
    }

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    let completeCoverImage = "";
    if (files.coverImage) {
      const coverImageMimeType = files.coverImage[0].mimetype.split("/").at(-1);
      const coverImageFileName = files.coverImage[0].filename;
      const coverImageFilePath = path.resolve(
        __dirname,
        "../public/data/uploads",
        coverImageFileName
      );
      completeCoverImage = coverImageFileName;
      //upload cover image to cloudinary
      const uploadResult = await cloudinary.uploader.upload(
        coverImageFilePath,
        {
          filename_override: completeCoverImage,
          folder: "book-covers",
          format: coverImageMimeType,
        }
      );
      completeCoverImage = uploadResult.secure_url;
      await fs.promises.unlink(coverImageFilePath);
    }
    let completeFileName = "";
    if (files.file) {
      const bookFileName = files.file[0].filename;
      const bookFilePath = path.resolve(
        __dirname,
        "../public/data/uploads",
        bookFileName
      );
      completeFileName=bookFileName;
       // Upload PDF to Cloudinary
    const uploadResultPdf = await cloudinary.uploader.upload(bookFilePath, {
      resource_type: "raw",
      filename_override: completeFileName,
      folder: "book-pdfs",
      format: "pdf",
  });
  completeFileName = uploadResultPdf.secure_url;
  await fs.promises.unlink(bookFilePath); 
    }
    const updatedBook = await Book.findOneAndUpdate(
      { _id: bookId },
      {
          title: title,
          description: description,
          genre: genre,
          coverImage: completeCoverImage ? completeCoverImage : book.coverImage,
          file: completeFileName ? completeFileName : book.file,
      },
      { new: true }
  );
  res.json(updatedBook);
  } catch (error) {
    console.error("Error occurred while updating the book:", error);
    return next(createHttpError(500, "Failed to update book"));
  }
  
};
//get all books
const getAllBooks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    console.error("Error retrieving books:", error);
    next(createHttpError(500, "Internal Server Error"));
  }
};

//get book by ID
const getSingleBook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const bookId = req.params.bookId;

    const book = await Book.findOne({ _id: bookId });
    if (!book) {
      return next(createHttpError(404, "No book found"));
    }
    res.json(book);
  } catch (error) {
    console.error("Error retrieving book:", error);
    next(createHttpError(500, "Internal Server Error"));
  }
};

const deleteBook = async (req: Request, res: Response, next: NextFunction) => {
  const bookId = req.params.bookId;

  try {
    // Find the book by ID
    const book = await Book.findOne({ _id: bookId });
    if (!book) {
      return next(createHttpError(404, "Book not found"));
    }

    // Check if the user is authorized to delete the book
    const _req = req as AuthRequest;
    if (book.author.toString() !== _req.userId) {
      return next(createHttpError(403, "You can not update others book."));
    }

    // Prepare Cloudinary public IDs for deletion
    const bookCoverImageSplit = book.coverImage.split("/");
    const bookCoverImagePublicId =
      bookCoverImageSplit.at(-2) +
      "/" +
      bookCoverImageSplit.at(-1)?.split(".").at(-2);

    const bookFileSplit = book.file.split("/");
    const bookFilePublicId =
      bookFileSplit.at(-2) + "/" + bookFileSplit.at(-1);

    // Delete the book's cover image and file from Cloudinary
    await cloudinary.uploader.destroy(bookCoverImagePublicId);
    await cloudinary.uploader.destroy(bookFilePublicId, {
      resource_type: "raw",
    });

    // Delete the book record from the database
    await Book.deleteOne({ _id: bookId });

    return res.sendStatus(204);
  } catch (error) {
    console.error("Error occurred while deleting the book:", error);
    return next(createHttpError(500, "Failed to delete book"));
  }
};

export { createBook, getAllBooks, getSingleBook, deleteBook, updateBook };
