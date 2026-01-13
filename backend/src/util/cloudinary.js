import { v2 as cloudinary } from "cloudinary"
import fs from "fs"

// Configuration
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Upload a file

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null
        //uploading the file
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        // File upload success
        console.log("File uploaded successfully on cloudinary", response.url);
        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath)    // Remove the locally saved temp file as it uploads ops get failed
        return null;
    }
}

export { uploadOnCloudinary }