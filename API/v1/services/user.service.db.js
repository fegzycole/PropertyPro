/* eslint-disable camelcase */
import _ from 'lodash';
import nodemailer from 'nodemailer';
import generator from 'generate-password';
import dotenv from 'dotenv';
import Db from '../Db/index';
import Helper from '../helper/helper';

dotenv.config();

const {
  hashAPassword,
  createToken,
  loginAUser,
  compareUserPasswordv2,
} = Helper;

const transport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USERNAME,
    pass: process.env.GMAIL_PASSWORD,
  },
});

/**
 * @exports UserService
 * @class UserService
 */
class UserService {
  /** Handles the logic for creating a new user
   * @static
   * @param {Object} userDetails request body
   * @returns {Object} containing required details of the newly created user or an error object
   * @memberof UserService
   */
  static async createUser(userDetails) {
    const {
      email, first_name, last_name, password, phone_number, address,
    } = userDetails;

    const hashedPassword = hashAPassword(password);

    const isAdmin = false;

    const query = 'INSERT INTO users (email, first_name, last_name, password, phone_number, address, is_admin) VALUES ($1, $2, $3, $4, $5, $6, $7) returning *';

    const { rows } = await Db.query(query, [email, first_name, last_name,
      hashedPassword, phone_number, address, isAdmin]);

    const payLoad = _.pick(rows[0], ['id', 'email', 'first_name', 'last_name']);

    rows[0].token = createToken(payLoad);

    const response = _.pick(rows[0], ['id', 'email', 'first_name', 'last_name', 'token']);

    response.id = parseInt(response.id, 10);
    return response;
  }


  /** Handles the logic for logging a user in
   * @static
   * @param {Object} userDetails request body
   * @returns {Object} containing required details of the user or an error object
   * @memberof UserService
   */
  static async loginUser(user) {
    const { email, password } = user.body;
    const userInfo = await loginAUser(email);

    if (!userInfo) throw new Error('Authorization failed. Email or password incorrect');

    const payLoad = _.pick(userInfo, ['id', 'email', 'first_name', 'last_name', 'is_admin']);

    const comparePassword = await compareUserPasswordv2(email, password);

    if (!comparePassword) throw new Error('Authorization failed. Email or password incorrect');

    userInfo.token = createToken(payLoad);

    const response = _.pick(userInfo, ['id', 'email', 'first_name', 'last_name', 'is_admin', 'token']);

    response.id = parseInt(response.id, 10);

    return response;
  }


  /** Handles the logic for logging a user in
   * @static
   * @param {Object} req request body
   * @returns {Object} containing required details of the user or an error object
   * @memberof UserService
   */
  static async resetPassword(req) {
    const { password, new_password } = req.body;
    const { email } = req.params;
    let hashedPassword;
    const mailOptions = {
      from: 'noreply@propertypro.com',
      to: `${email}`,
      subject: 'Password Reset',
    };
    if (!password && !new_password) {
      const newPassword = generator.generate({ length: 10, numbers: true });
      hashedPassword = hashAPassword(newPassword);
      mailOptions.html = `<p>Your password reset is successful, your new password is ${newPassword}</p>`;
    }
    if (password && new_password) {
      hashedPassword = hashAPassword(new_password);
      mailOptions.html = `<p>Your password reset is successful, your new password is ${new_password}</p>`;
    }
    const { rows } = await Db.query(`UPDATE users SET password = '${hashedPassword}' WHERE email = '${email}' RETURNING *`);
    await transport.sendMail(mailOptions);
    return rows[0];
  }
}

export default UserService;
