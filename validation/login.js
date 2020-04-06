const Validator = require("validator");
const isEmpty = require("./is_empty");

module.exports = function validateLoginInput(data) {
  let errors = {};

  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";

  if (!Validator.isEmail(data.email)) {
    errors.email = "Geçersiz bir email adresi!";
  }

  if (Validator.isEmpty(data.email)) {
    errors.email = "Email alanı gereklidir!";
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = "Şifre alanı gereklidir!";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
