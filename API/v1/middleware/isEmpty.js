/**
   *
   * Checks to see if a parameter is empty
   * @param {any} val
   * @returns {Boolean}
   */
const isEmpty = val => val === undefined
  || val == null
  || val === ''
  || (typeof val === 'object' && Object.keys(val).length === 0)
  || (typeof val === 'string' && val.trim().length === 0);

export default isEmpty;
