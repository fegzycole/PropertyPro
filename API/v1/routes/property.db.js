import express from 'express';
import trimmer from 'express-body-trimmer';
import AuthenticateUser from '../middleware/AuthenticateUser';
import Validation from '../middleware/validation';
import uploadAnImage from '../middleware/imageUpload';
import PropertyController from '../controller/property.controller.db';

const { postAProperty } = PropertyController;

const {
  authenticateUser,
  authenticateAnAdmin,
  checkContentType,
} = AuthenticateUser;

const {
  checkForEmptyPropertyPostParameters,
  validateCreatePropertyInput,
} = Validation;

const router = express.Router();

router.post('/',
  authenticateUser,
  authenticateAnAdmin,
  checkContentType,
  uploadAnImage,
  trimmer(),
  checkForEmptyPropertyPostParameters,
  validateCreatePropertyInput,
  postAProperty);

export default router;
