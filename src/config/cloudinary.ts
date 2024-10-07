import { v2 as cloudinary } from "cloudinary";
import { config as conf } from "./config";
  
  // Configuration
  cloudinary.config({ 
    cloud_name: conf.cloudinaryCloudName,
    api_key: conf.cloudinaryApiKey,
    api_secret: conf.cloudinaryApiSecret
});