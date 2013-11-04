/**
 * Created by gumbia on 11/4/13.
 */

function isRequiredSatistied(str) {
  var trimmed_str = $.trim(str);
  return (trimmed_str.length != 0)
}

function isEmailSatisfied(str) {
  var pattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return pattern.test(str);
}

function isURLSatisfied(str) {
  var pattern = new RegExp("https?://.+");
  return pattern.test(str);
}
