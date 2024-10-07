import {config as conf} from "dotenv";

conf(); // Load environment variables from .env

const _config={
    port:process.env.PORT,
    databaseURL:process.env.MONGO_URL,
    env:process.env.NODE_ENV,
    secret:process.env.SECRET,
    cloudinaryCloudName:process.env.CLOUDINARY_API_SECRET,
    cloudinaryApiKey:process.env.CLOUDINARY_API_KEY,
    cloudinaryApiSecret:process.env.CLOUDINARY_API_SECRET
}

export const config=Object.freeze(_config);