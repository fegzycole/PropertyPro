import express from 'express';
import trimmer from 'express-body-trimmer';
import AuthenticateUser from '../middleware/AuthenticateUser';
import Validation from '../middleware/validation';
import uploadAnImage from '../middleware/imageUpload';
import PropertyController from '../controller/property.controller.db';

const {
  postAProperty,
  updateProperty,
  updatePropertyStatus,
  deleteAProperty,
  getAllProperties,
  getPropertyByStatus,
  getPropertyById,
} = PropertyController;

const {
  authenticateUser,
  authenticateAnAdmin,
  checkContentType,
  checkPropertyIdAndVerifyOwner,
} = AuthenticateUser;

const {
  checkForEmptyPropertyPostParameters,
  validateCreatePropertyInput,
  checkForInvalidUpdateParameters,
  validateId,
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
  validateId,
  checkPropertyIdAndVerifyOwner,
  uploadAnImage,
  trimmer(),
  checkForInvalidUpdateParameters,
  updateProperty);

router.patch('/:id/sold',
  authenticateUser,
  authenticateAnAdmin,
  validateId,
  checkPropertyIdAndVerifyOwner,
  updatePropertyStatus);

router.delete('/:id',
  authenticateUser,
  authenticateAnAdmin,
  validateId,
  checkPropertyIdAndVerifyOwner,
  deleteAProperty);

router.get('/',
  authenticateUser,
  getAllProperties);

router.get('/',
  getPropertyByStatus);

router.get('/:id',
  authenticateUser,
  validateId,
  getPropertyById);

export default router;
