import express from 'express';
import UserController from '../controller/user.controller.db';
import Validation from '../middleware/validation';
import checkExixtingEmail from '../middleware/checkExistingemail';

const router = express.Router();

const { createUser } = UserController;

const { validateSignUpInput, checkForEmptyRequestParameters } = Validation;

router.post('/signup',
  checkForEmptyRequestParameters,
  validateSignUpInput,
  checkExixtingEmail,
  createUser);

export default router;
