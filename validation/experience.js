const Validator = require("validator");
const isEmpty = require("./is_empty");

module.exports = function validateExperinceInput(data) {
  let errors = {};

  data.title = !isEmpty(data.title) ? data.title : "";
  data.company = !isEmpty(data.company) ? data.company : "";
  data.from = !isEmpty(data.from) ? data.from : "";

  if (Validator.isEmpty(data.title)) {
    errors.title = "İş Adı alanı gereklidir!";
  }

  if (Validator.isEmpty(data.company)) {
    errors.company = "Şirket alanı gereklidir!";
  }

  if (Validator.isEmpty(data.from)) {
    errors.from = "Başlangıç alanı gereklidir!";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
