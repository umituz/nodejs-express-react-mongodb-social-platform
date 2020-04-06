const Validator = require("validator");
const isEmpty = require("./is_empty");

module.exports = function validateRegisterInput(data) {
  let errors = {};

  data.name = !isEmpty(data.name) ? data.name : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.password2 = !isEmpty(data.password2) ? data.password2 : "";

  if (!Validator.isLength(data.name, { min: 3, max: 30 })) {
    errors.name = "İsim alanı en az 3 en fazla 30 karakter olabilir.";
  }

  // Validasyon kontrolü

  if (Validator.isEmpty(data.name)) {
    errors.name = "İsim alanı gereklidir!";
  }

  if (!Validator.isEmail(data.email)) {
    errors.email = "Geçersiz bir email adresi!";
  }

  if (Validator.isEmpty(data.email)) {
    errors.email = "Email alanı gereklidir!";
  }

  if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.password = "Şifre en az 6, en fazla 30 karakter olabilir!";
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = "Şifre alanı gereklidir!";
  }

  if (!Validator.isLength(data.password2, { min: 6, max: 30 })) {
    errors.password2 =
      "Doğrulama şifre en az 6, en fazla 30 karakter olabilir!";
  }

  if (Validator.isEmpty(data.password2)) {
    errors.password2 = "Doğrulama şifre alanı gereklidir!";
  }

  if (!Validator.equals(data.password, data.password2)) {
    errors.password2 = "Şifreler birbiryle uyuşmuyor!";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
