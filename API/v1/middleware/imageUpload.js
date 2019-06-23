import multer from 'multer';
import cloudinary from 'cloudinary';
import cloudStorage from 'multer-storage-cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = cloudStorage({
  cloudinary,
  folder: 'propertypro',
  allowedFormats: ['jpg', 'png'],
});


const uploader = multer({ storage }).single('image');

export default uploader;
