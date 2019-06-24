import express from 'express';
import AuthenticateUser from '../middleware/AuthenticateUser';
import Validation from '../middleware/validation';
import PropertyController from '../controller/property.controller';

const {
  postAProperty, updateProperty,
  updatePropertyStatus, deleteAProperty,
} = PropertyController;

const {
  checkForEmptyPropertyPostParameters,
  validateCreatePropertyInput, uploadAnImage, checkPropertyId,
  checkForInvalidUpdateParameters, compareAgentsByEmail, checkStatusParameter,
} = Validation;

const { authenticateUser } = AuthenticateUser;

const router = express.Router();

router.post('/', authenticateUser, uploadAnImage,
  checkForEmptyPropertyPostParameters,
  validateCreatePropertyInput, postAProperty);

router.patch('/:id', authenticateUser, checkPropertyId,
  compareAgentsByEmail, uploadAnImage,
  checkForInvalidUpdateParameters, updateProperty);

router.patch('/:id/sold', authenticateUser, checkPropertyId,
  compareAgentsByEmail, checkStatusParameter, updatePropertyStatus);

router.delete('/:id', authenticateUser, checkPropertyId, compareAgentsByEmail, deleteAProperty);

export default router;
