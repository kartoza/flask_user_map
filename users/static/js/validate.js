/**
 * Author: Akbar Gumbira (akbargumbira@gmail.com)
 * Description:
 * This file contains simple javascript validation.
 * It follows Airbnb Javascript style guide (https://github.com/airbnb/javascript)
 * and JSDoc for the documentation.
 */

/**
 * Validate if a string is not an empty string
 * @param {string} str The string that needs to be validated.
 * @returns {boolean}
 */
function isRequiredSatistied(str) {
  var trimmed_str = $.trim(str);
  return (trimmed_str.length != 0)
}

/**
 * Validate if a string is an 'email' format.
 * It is a simple validation, not really following the exact RFC.
 * @param {string} str The string that needs to be validated.
 * @returns {boolean}
 */
function isEmailSatisfied(str) {
  var pattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return pattern.test(str);
}

/**
 * Validate if a string is an 'URL' format, in http or https protocol.
 * @param {string} str The string that needs to be validated.
 * @returns {boolean}
 */
function isURLSatisfied(str) {
  var pattern = new RegExp("https?://.+");
  return pattern.test(str);
}

/**
 * Validate if a string is a non negative number.
 * @param str
 * @returns {boolean}
 */
function isNonNegativeNumber(str) {
  if (str.length == 0) {
    return false;
  }

  var intValue = parseInt(str, 10);
  if (isNaN(intValue) || (intValue < 0)) {
    return false;
  }
  return true;
}

/**
 * Validate if a date string is in ISO 8601 format (yyyyy-mm-dd)
 * @param str
 * @returns {boolean}
 */
function isISO8601DateFormat(str) {
  return !isNaN(Date.parse(str));
}
