class Property {
  /**
   *Creates an instance of User.
   * @param {Integer} id
   * @param {Integer} owner
   * @param {String} status
   * @param {Float} price
   * @param {String} state
   * @param {String} city
   * @param {String} address
   * @param {String} type
   * @param {Date} createdOn
   * @param {String} imageUrl
   * @memberof User
   */
  constructor(id, owner, status, price, state, city, address, type, createdOn, imageUrl) {
    this.id = id;
    this.owner = owner;
    this.status = status;
    this.price = price;
    this.state = state;
    this.city = city;
    this.address = address;
    this.type = type;
    this.createdOn = createdOn;
    this.imageUrl = imageUrl;
  }
}

export default Property;
