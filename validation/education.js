const Validator = require("validator");
const isEmpty = require("./is_empty");

module.exports = function validateEducationInput(data) {
  let errors = {};

  data.school = !isEmpty(data.school) ? data.school : "";
  data.degree = !isEmpty(data.degree) ? data.degree : "";
  data.fieldofstudy = !isEmpty(data.fieldofstudy) ? data.fieldofstudy : "";
  data.from = !isEmpty(data.from) ? data.from : "";

  if (Validator.isEmpty(data.school)) {
    errors.school = "Okul adı alanı gereklidir!";
  }

  if (Validator.isEmpty(data.degree)) {
    errors.degree = "Diploma alanı gereklidir!";
  }

  if (Validator.isEmpty(data.fieldofstudy)) {
    errors.fieldofstudy = "Branş alanı gereklidir!";
  }

  if (Validator.isEmpty(data.from)) {
    errors.from = "Başlangıç alanı gereklidir!";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
