import express from 'express';
// import upload from '../middleware/imageUpload';
import AuthenticateUser from '../middleware/AuthenticateUser';
import Validation from '../middleware/validation';
import PropertyController from '../controller/property.controller';

const { postAProperty, updateProperty } = PropertyController;

const {
  checkForEmptyPropertyPostParameters,
  validateCreatePropertyInput, uploadAnImage, checkAgentId,
  checkForInvalidRequestParameters, checkForInvalidUpdateParameters,
} = Validation;

const { authenticateUser } = AuthenticateUser;

const router = express.Router();

router.post('/', authenticateUser, uploadAnImage,
  checkForEmptyPropertyPostParameters,
  validateCreatePropertyInput, postAProperty);

router.patch('/:id', authenticateUser, checkAgentId,
  uploadAnImage, checkForInvalidRequestParameters, checkForInvalidUpdateParameters, updateProperty);

export default router;
