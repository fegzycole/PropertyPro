import express from 'express';
import Validation from '../middleware/validation';
import UserController from '../controller/user.controller';

const {
  createUserAccount,
  loginUser,
} = UserController;

const {
  validateSignUpInput,
  checkForEmptyRequestParameters,
  checkLoginParameters,
  checkForEmptySignInParameters,
} = Validation;

const router = express.Router();

router.post('/signup',
  checkForEmptyRequestParameters,
  validateSignUpInput,
  createUserAccount);

router.post('/signin',
  checkForEmptySignInParameters,
  checkLoginParameters,
  loginUser);

export default router;
