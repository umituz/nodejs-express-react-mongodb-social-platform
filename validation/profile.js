const Validator = require("validator");
const isEmpty = require("./is_empty");

module.exports = function validateLoginInput(data) {
  let errors = {};

  data.handle = !isEmpty(data.handle) ? data.handle : "";
  data.status = !isEmpty(data.status) ? data.status : "";
  data.skills = !isEmpty(data.skills) ? data.skills : "";

  if (!Validator.isLength(data.handle, { min: 2, max: 40 })) {
    errors.handle = "Kullanıcı adı en az 2 ile en fazla 40 karakter olabilir.";
  }

  if (Validator.isEmpty(data.handle)) {
    errors.handle = "Kullanıcı adı gereklidir.";
  }

  if (Validator.isEmpty(data.status)) {
    errors.status = "Pozisyon gereklidir.";
  }

  if (Validator.isEmpty(data.skills)) {
    errors.skills = "Yetenekler gereklidir.";
  }

  if (!isEmpty(data.website)) {
    if (!Validator.isURL(data.website)) {
      errors.website = "Geçersiz bir URL adresi.";
    }
  }

  if (!isEmpty(data.youtube)) {
    if (!Validator.isURL(data.youtube)) {
      errors.youtube = "Geçersiz bir URL adresi.";
    }
  }

  if (!isEmpty(data.facebook)) {
    if (!Validator.isURL(data.facebook)) {
      errors.facebook = "Geçersiz bir URL adresi.";
    }
  }

  if (!isEmpty(data.twitter)) {
    if (!Validator.isURL(data.twitter)) {
      errors.twitter = "Geçersiz bir URL adresi.";
    }
  }

  if (!isEmpty(data.instagram)) {
    if (!Validator.isURL(data.instagram)) {
      errors.instagram = "Geçersiz bir URL adresi.";
    }
  }

  if (!isEmpty(data.linkedin)) {
    if (!Validator.isURL(data.linkedin)) {
      errors.linkedin = "Geçersiz bir URL adresi.";
    }
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
