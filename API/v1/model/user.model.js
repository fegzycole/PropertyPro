/* eslint-disable camelcase */
/**
 * @exports User
 * @class User
 */
class User {
  /**
   *Creates an instance of User.
   * @param {Integer} id
   * @param {String} email
   * @param {String} firstName
   * @param {String} lastName
   * @param {String} password
   * @param {String} phoneNumber
   * @param {String} address
   * @param {Boolean} is_admin
   * @memberof User
   */
  constructor(id, email, firstName, lastName, password, phone_number, address, is_admin) {
    this.id = id;
    this.email = email;
    this.firstName = firstName;
    this.lastName = lastName;
    this.password = password;
    this.phone_number = phone_number;
    this.address = address;
    this.isAdmin = is_admin;
  }
}

export default User;
