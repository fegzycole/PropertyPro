import express from 'express';
import trimmer from 'express-body-trimmer';
import AuthenticateUser from '../middleware/AuthenticateUser';
import Validation from '../middleware/validation';
import uploadAnImage from '../middleware/imageUpload';
import PropertyController from '../controller/property.controller.db';
import checkPropertyId from '../middleware/checkPropertyId';

const {
  postAProperty,
  updateProperty,
  updatePropertyStatus,
  deleteAProperty,
  getAllProperties,
  getPropertyByStatus,
} = PropertyController;

const {
  authenticateUser,
  authenticateAnAdmin,
  checkContentType,
} = AuthenticateUser;

const {
  checkForEmptyPropertyPostParameters,
  validateCreatePropertyInput,
  checkForInvalidUpdateParameters,
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

router.patch('/:id',
  authenticateUser,
  authenticateAnAdmin,
  checkContentType,
  checkPropertyId,
  uploadAnImage,
  trimmer(),
  checkForInvalidUpdateParameters,
  updateProperty);

router.patch('/:id/sold',
  authenticateUser,
  authenticateAnAdmin,
  checkPropertyId,
  updatePropertyStatus);

router.delete('/:id',
  authenticateUser,
  authenticateAnAdmin,
  checkPropertyId,
  deleteAProperty);

router.get('/',
  authenticateUser,
  getAllProperties);

router.get('/',
  getPropertyByStatus);

export default router;
