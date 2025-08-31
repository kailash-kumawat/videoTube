import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCoudinary = async function (localFilePath) {
  try {
    if (!localFilePath) return null;

    //UPLOAD THE FILE ON CLOUDINARY
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    //FILE SUCCESFULLY UPLOADED
    console.log("File is uploaded on cloudinary", response.url);
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath); // REMOVE THE LOCALLY SAVED TEMP. FILE AS THE
    // UPLOAD OPERATION GOT FAILED.
    return null;
  }
};

export { uploadOnCoudinary };
