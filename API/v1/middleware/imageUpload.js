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


const uploader = multer({ storage }).single('image_url');

/**
   *
   * Tries to upload an image and checks to see if there is an internet connection
   * @static
   * @param {Object} req
   * @param {Object} res
   * @param {function} next
   * @returns {(function|Object)} function next() or an error response object
   */
const uploadAnImage = (req, res, next) => {
  uploader(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        status: 'error',
        error: err.message,
      });
    }
    return next();
  });
};

export default uploadAnImage;
