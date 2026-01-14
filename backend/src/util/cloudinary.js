import { v2 as cloudinary } from "cloudinary"
import fs from "fs"

// Configuration
cloudinary.config({ 
    cloud_name: "dpoq85fg3", 
    api_key: 443227379179538, 
    api_secret: "kpbWzH4zQxUUuw3Rf4KlEPUi0aY"
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
        fs.unlinkSync(localFilePath); 
        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath)    // Remove the locally saved temp file as it uploads on cloudinary failed
        console.error("Error uploading file on cloudinary", error);
        return null;
    }
}

export { uploadOnCloudinary }