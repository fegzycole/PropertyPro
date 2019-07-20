import express from 'express';
import Validation from '../middleware/validation';
import UserController from '../controller/user.controller';

const {
  createUserAccount,
  loginUser,
} = UserController;

const {
  validateSignUpInput,
  checkLoginParameters,
  checkForEmptySignInParameters,
} = Validation;

const router = express.Router();

router.post('/signup',
  validateSignUpInput,
  createUserAccount);

router.post('/signin',
  checkForEmptySignInParameters,
  checkLoginParameters,
  loginUser);

export default router;
