const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

// User Model
const User = require("../../models/User");
// Profile Model
const Profile = require("../../models/Profile");

const validateProfileInput = require("../../validation/profile");
const validateExperienceInput = require("../../validation/experience");
const validateEducationInput = require("../../validation/education");

// @route   GET api/profile
// @desc     Mevcut kullanıcıyı verir
// @access  Private => Gizli
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};
    Profile.findOne({ user: req.user.id })
      .populate("user", ["name", "avatar"])
      .then(profile => {
        if (!profile) {
          errors.noprofile = "Bu kullanıcının profili yoktur!";
          return res.status(404).json(errors);
        }
        res.json(profile);
      })
      .catch(err => res.status(404).json(err));
  }
);

// @route   GET api/profile/handle/:handle
// @desc    Kullanıcı adıyla bilgilere ulaşmak.
// @access  Public => Herke Açık

router.get("/handle/:handle", (req, res) => {
  const errors = {};
  Profile.findOne({ handle: req.params.handle })
    .populate("user", ["name", "avatar"])
    .then(profile => {
      if (!profile) {
        errors.noprofile = "Bu kullanıcının profili yoktur!";
        return res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(err => res.status(404).json(err));
});

// @route   GET api/profile/all
// @desc    Bütün kullanıcıları listeler.
// @access  Public => Herke Açık
router.get("/all", (req, res) => {
  const errors = {};
  Profile.find()
    .populate("user", ["name", "avatar"])
    .then(profiles => {
      if (!profiles) {
        errors.noprofile = "Hiçbir kullanıcı yoktur sistemde!";
        res.status(400).json(errors);
      }
      res.json(profiles);
    })
    .catch(err =>
      res.status(404).json({
        noprofile: "Sistemde kullanıcı yoktur!"
      })
    );
});

// @route   GET api/profile/user/:user_id
// @desc    Kullanıcı id'si ile bilgilere ulaşmak.
// @access  Public => Herke Açık

router.get("/user/:user_id", (req, res) => {
  const errors = {};
  Profile.findOne({ user: req.params.user_id })
    .populate("user", ["name", "avatar"])
    .then(profile => {
      if (!profile) {
        errors.noprofile = "Bu kullanıcının profili yoktur!";
        return res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(err =>
      res.status(404).json({
        noprofile: "Böyle bir kullanıcı yoktur!"
      })
    );
});

// @route   POST api/profile
// @desc     Kullanıcının profil bilgilerini oluşturur.
// @access  Private => Gizli
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateProfileInput(req.body);

    // Validasyon boş değilse yani hata varsa if bloğun içinden hata döndür
    if (!isValid) {
      return res.status(400).json(errors);
    }

    // Formdan gelen verileri profileFields nesnesine at.
    const profileFields = {};
    profileFields.user = req.user.id;
    if (req.body.handle) profileFields.handle = req.body.handle;
    if (req.body.company) profileFields.company = req.body.company;
    if (req.body.website) profileFields.website = req.body.website;
    if (req.body.location) profileFields.location = req.body.location;
    if (req.body.bio) profileFields.bio = req.body.bio;
    if (req.body.status) profileFields.status = req.body.status;
    if (req.body.githubusername)
      profileFields.githubusername = req.body.githubusername;

    // Dizi olan yetenekleri split , ile ayırıyoruz.
    if (typeof req.body.skills !== "undefined") {
      profileFields.skills = req.body.skills.split(",");
    }

    // Sosyal Medya Hesapları
    profileFields.social = {};
    if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
    if (req.body.instagram) profileFields.social.instagram = req.body.instagram;

    Profile.findOne({ user: req.user.id }).then(profile => {
      if (profile) {
        // Kullanıcının profil bilgileri daha önceden varsa güncelleme işlemi
        Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        ).then(profile => res.json(profile));
      } else {
        // Kullanıcının profil bilgileri daha önceden yoksa ekleme işlemi
        // Kullanıcı adı => handle kontrolü
        Profile.findOne({ handle: profileFields.handle }).then(profile => {
          if (profile) {
            errors.handle = "Bu kullanıcı adı daha önceden kayıt edilmiştir!";
            res.status(400).json(errors);
          }
          // Kullanıcı profilini kaydetme işlemleri.
          new Profile(profileFields).save().then(profile => res.json(profile));
        });
      }
    });
  }
);

// @route   POST api/profile/experience
// @desc    Kullanıcının tecrübelerini ekler profil bölümüne.
// @access  Private => Gizli
router.post(
  "/experience",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateExperienceInput(req.body);

    // Validasyon boş değilse yani hata varsa if bloğun içinden hata döndür
    if (!isValid) {
      return res.status(400).json(errors);
    }

    Profile.findOne({ user: req.user.id }).then(profile => {
      if (profile) {
        const newExp = {
          title: req.body.title,
          company: req.body.company,
          location: req.body.location,
          from: req.body.from,
          to: req.body.to,
          current: req.body.current,
          description: req.body.description
        };

        // Profil Dökümanının experince dizisine ekleyeceğiz newExp değerlerini
        profile.experience.unshift(newExp);
        // Ekledikten sonra profil dökümanını güncelleme işlemi yap.
        profile.save().then(profile => {
          res.json(profile);
        });
      }
    });
  }
);

// @route   POST api/profile/education
// @desc    Kullanıcının eğitim bilgilerini ekler profil bölümüne.
// @access  Private => Gizli
router.post(
  "/education",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateEducationInput(req.body);

    // Validasyon boş değilse yani hata varsa if bloğun içinden hata döndür
    if (!isValid) {
      return res.status(400).json(errors);
    }

    Profile.findOne({ user: req.user.id }).then(profile => {
      if (profile) {
        const newEdu = {
          school: req.body.school,
          degree: req.body.degree,
          fieldofstudy: req.body.fieldofstudy,
          from: req.body.from,
          to: req.body.to,
          current: req.body.current,
          description: req.body.description
        };

        // Profil Dökümanının experince dizisine ekleyeceğiz newExp değerlerini
        profile.education.unshift(newEdu);
        // Ekledikten sonra profil dökümanını güncelleme işlemi yap.
        profile.save().then(profile => {
          res.json(profile);
        });
      }
    });
  }
);

// @route   DELETE api/profile/experience/:exp_id
// @desc    Kullanıcının deneyim bilgilerini siler profil bölümünden.
// @access  Private => Gizli
router.delete(
  "/experience/:exp_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        if (profile) {
          const removeIndex = profile.experience
            .map(item => item.id)
            .indexOf(req.params.exp_id);

          profile.experience.splice(removeIndex, 1);
          profile.save().then(profile => res.json(profile));
        }
      })
      .catch(err => res.status(404).json(err));
  }
);

// @route   DELETE api/profile/education/:edu_id
// @desc    Kullanıcının eğitim bilgilerini siler profil bölümünden.
// @access  Private => Gizli
router.delete(
  "/education/:edu_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        if (profile) {
          const removeIndex = profile.education
            .map(item => item.id)
            .indexOf(req.params.edu_id);

          profile.education.splice(removeIndex, 1);
          profile.save().then(profile => res.json(profile));
        }
      })
      .catch(err => res.status(404).json(err));
  }
);

// @route   DELETE api/profile/education/:edu_id
// @desc    Kullanıcının eğitim bilgilerini siler profil bölümünden.
// @access  Private => Gizli
router.delete(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOneAndRemove({ user: req.user.id }).then(() => {
      User.findOneAndRemove({ _id: req.user.id }).then(() => {
        res.json({ success: true });
      });
    });
  }
);

module.exports = router;
