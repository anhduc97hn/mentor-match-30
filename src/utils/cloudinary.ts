import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET } from "../appService/config";
import axios from "axios";

interface CloudinaryResponse {
  secure_url: string;
  [key: string]: any;
}

export const cloudinaryUpload = async (image: File | null): Promise<string> => {
  if (!image) return "";
  
  try {
    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    
    const response: CloudinaryResponse = await axios({
      url: `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      method: "POST",
      data: formData,
      headers: { "Content-Type": "multipart/form-data" },
    });
    
    const imageUrl: string = response.data.secure_url;
    return imageUrl;
  } catch (error) {
    throw error;
  }
};