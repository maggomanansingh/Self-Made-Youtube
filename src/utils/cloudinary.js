import {v2 as cloudinary} from "cloudinary"
import fs from "fs"

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Log the configuration
console.log(cloudinary.config());

const uploadOnCloudinary = async (localFilePath)=>{
    const options = {
      resource_type:"auto"
    };
    try {
        // console.log(localFilePath);
        
        if (!localFilePath) {
            return null;
        }
        
        const result = await cloudinary.uploader.upload(localFilePath, options);
        fs.unlinkSync(localFilePath)
        // File has been uploaded successfully
        // console.log("file upload successfull\n");
        // console.log(result);
        return result;        
    } catch (errors) {
        fs.unlinkSync(localFilePath) // removed the locally saved temp file as the upload opr. get falied
        console.log("file upload UNsuccessfull\n",errors);
        return null;        
    }
}

export {uploadOnCloudinary};