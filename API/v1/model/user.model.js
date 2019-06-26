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
   * @param {Boolean} isAdmin
   * @memberof User
   */
  constructor(id, email, firstName, lastName, password, phoneNumber, address, isAdmin) {
    this.id = id;
    this.email = email;
    this.firstName = firstName;
    this.lastName = lastName;
    this.password = password;
    this.phoneNumber = phoneNumber;
    this.address = address;
    this.isAdmin = isAdmin;
  }
}

export default User;
