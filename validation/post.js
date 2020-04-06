const Validator = require("validator");
const isEmpty = require("./is_empty");

module.exports = function validatePostInput(data) {
  let errors = {};

  data.text = !isEmpty(data.text) ? data.text : "";

  if (!Validator.isLength(data.text, { min: 10, max: 300 })) {
    errors.text = "Metin en az 10 ile en fazla 300 karakter olabilir.";
  }

  if (Validator.isEmpty(data.text)) {
    errors.text = "Metin alanı gereklidir!";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
