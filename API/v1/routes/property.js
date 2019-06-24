import express from 'express';
import AuthenticateUser from '../middleware/AuthenticateUser';
import Validation from '../middleware/validation';
import PropertyController from '../controller/property.controller';

const { postAProperty, updateProperty, updatePropertyStatus } = PropertyController;

const {
  checkForEmptyPropertyPostParameters,
  validateCreatePropertyInput, uploadAnImage, checkAgentId,
  checkForInvalidUpdateParameters, compareAgentsByEmail, checkStatusParameter,
} = Validation;

const { authenticateUser } = AuthenticateUser;

const router = express.Router();

router.post('/', authenticateUser, uploadAnImage,
  checkForEmptyPropertyPostParameters,
  validateCreatePropertyInput, postAProperty);

router.patch('/:id', authenticateUser, checkAgentId,
  compareAgentsByEmail, uploadAnImage,
  checkForInvalidUpdateParameters, updateProperty);

router.patch('/:id/sold', authenticateUser, checkAgentId,
  compareAgentsByEmail, checkStatusParameter, updatePropertyStatus);

export default router;
