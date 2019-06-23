import express from 'express';
// import upload from '../middleware/imageUpload';
import AuthenticateUser from '../middleware/AuthenticateUser';
import Validation from '../middleware/validation';
import PropertyController from '../controller/property.controller';

const { postAProperty } = PropertyController;

const {
  checkForEmptyPropertyPostParameters,
  validateCreatePropertyInput, uploadAnImage,
} = Validation;

const { authenticateUser } = AuthenticateUser;

const router = express.Router();

router.post('/', authenticateUser, uploadAnImage,
  checkForEmptyPropertyPostParameters,
  validateCreatePropertyInput, postAProperty);

export default router;
