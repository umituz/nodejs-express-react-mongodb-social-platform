const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");

// Input Validasyonları
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

// User Model dosyasını çağırır.
const User = require("../../models/User");

// @route   GET api/users/test
// @desc    Test amaçlı bir route
// @access  Public => Herkese Açık
router.get("/test", (req, res) => {
  res.json({
    message: "Users Work"
  });
});

// @route   GET api/users/register
// @desc     Kullanıcının kaydolmasını sağlar
// @access  Public => Herkese Açık
router.post("/register", (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  // Validasyon kontrolü
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      errors.email = "Bu email daha önceden kayıt edilmiştir!!!";
      return res.status(400).json(errors);
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: "200", // Size
        r: "pg", // Rating
        d: "mm" // Default
      });

      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        avatar // ES6+ avatar:avatar yerine sadece avatar
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

// @route   GET api/users/login
// @desc    Kullanıcının giriş yapıp yapmamasını sağlar. JWT Token üretir.
// @access  Public => Herkese Açık
router.post("/login", (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  // Validasyon kontrolü
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email })
    .then(user => {
      if (!user) {
        // Kullanıcının olup olmadığını sorgular
        errors.email = "Böyle bir kullanıcı yoktur!";
        return res.status(404).json(errors);
      }

      // Request ile gelen şifreyi veritabanındaki hash'li şifre ile karşılaştır.
      bcrypt
        .compare(password, user.password)
        .then(isMatch => {
          if (isMatch) {
            // Email adresi ve şifre doğruysa yani kullanıcı eşleştiyse

            const payload = {
              id: user.id,
              name: user.name,
              email: user.email,
              avatar: user.avatar
            };

            jwt.sign(
              payload,
              keys.secretOrKey,
              { expiresIn: 3600 },
              (err, token) => {
                res.json({
                  success: true,
                  token: "Bearer " + token
                });
              }
            );
          } else {
            errors.password = "Şifre hatalıdır!";
            return res.status(400).json(errors);
          }
        })
        .catch();
    })
    .catch();
});

// @route   GET api/users/current
// @desc    Mevcut kullanıcıyı verir.
// @access  Private => Gizli
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email
    });
  }
);

module.exports = router;
