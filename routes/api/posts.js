const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

// Post Model Dosyasını Çağır.
const Post = require("../../models/Post");
// Profil Model Dosyasını Çağır.
const Profile = require("../../models/Profile");

// Post Validasyon
const validatePostInput = require("../../validation/post");

// @route   GET api/posts/test
// @desc    Test amaçlı bir route
// @access  Public => Herkese Açık
router.get("/test", (req, res) => {
  res.json({
    message: "Posts Work"
  });
});

// @route   GET api/posts
// @desc    Mevcut metinleri döndürür.
// @access  Public => Herkese Açık
router.get("/", (req, res) => {
  Post.find()
    .sort({ date: -1 })
    .then(posts => res.json(posts))
    .catch(err =>
      res.status(404).json({ nopostsfound: "Hiçbir metin bulunamadı" })
    );
});

// @route   GET api/posts/:id
// @desc    Verilen id'li metini döndürür.
// @access  Public => Herkese Açık
router.get("/:id", (req, res) => {
  Post.findById(req.params.id)
    .then(post => res.json(post))
    .catch(err =>
      res.status(404).json({ nopostfound: "Verilen id'li metin bulunamadı!" })
    );
});

// @route   POST api/posts
// @desc    İçerik oluştur.
// @access  Private => Gizli
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    // Validasyon boş değilse yani hata varsa if bloğun içinden hata döndür
    if (!isValid) {
      return res.status(400).json(errors);
    }

    const newPost = new Post({
      text: req.body.text,
      name: req.body.name,
      avatar: req.body.avatar,
      user: req.user.id
    });

    newPost.save().then(post => res.json(post));
  }
);

// @route   DELETE api/posts/:id
// @desc    İçerik siler.
// @access  Private => Gizli
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          // Kullanıcı kontrül işlemi
          if (post.user.toString() !== req.user.id) {
            return res
              .status(401)
              .json({ unauthorized: "Kullanıcı oturum açmadı!" });
          }

          // Silme işlemi
          post.remove().then(() => res.json({ success: true }));
        })
        .catch(err =>
          res.status(404).json({ postnotfound: "İçerik bulunamadı!" })
        );
    });
  }
);

// @route   POST api/posts/like/:id
// @desc    İçerik beğenimi.
// @access  Private => Gizli
router.post(
  "/like/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          // post içerisindeki likes içinde her biri elemanın içinde filtreleme işlemi
          // yaptıktan sonra sonuç sıfırdan büyükse içeriği daha önceden beğenmiş olur.
          if (
            post.likes.filter(like => like.user.toString() === req.user.id)
              .length > 0
          ) {
            return res.status(400).json({
              alreadyExist: "Kullanıcı zaten bu içeriği beğenmiştir!"
            });
          }

          // Eğer daha önce beğenmemişse likes dizisinin başına user'ın id'sini atar.
          post.likes.unshift({ user: req.user.id });

          // post günceller.
          post.save().then(post => res.json(post));
        })
        .catch(err =>
          res.status(404).json({ postnotfound: "İçerik bulunamadı!" })
        );
    });
  }
);

// @route   POSt api/posts/unlike/:id
// @desc    İçerik beğenimini kaldır.
// @access  Private => Gizli
router.post(
  "/unlike/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          // post içerisindeki likes içinde her biri elemanın içinde filtreleme işlemi
          // yaptıktan sonra sonuç sıfırdan büyükse içeriği daha önceden beğenmiş olur.
          if (
            post.likes.filter(like => like.user.toString() === req.user.id)
              .length === 0
          ) {
            return res.status(400).json({
              notliked:
                "Kullanıcı henüz içeriği beğenmemiştir. Bu yüzden kaldıramaz!"
            });
          }

          // Beğeni kaldırma işlemi
          const removeIndex = post.likes
            .map(item => item.user.toString())
            .indexOf(req.user.id);

          // Diziden index kaldır
          post.likes.splice(removeIndex, 1);

          // Güncelleme işlemi
          post.save().then(post => res.json(post));
        })
        .catch(err =>
          res.status(404).json({ postnotfound: "İçerik bulunamadı!" })
        );
    });
  }
);

// @route   POSt api/posts/comment/:id
// @desc    İçerik yorumunu gösterir.
// @access  Private => Gizli
router.post(
  "/comment/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }

    Post.findById(req.params.id)
      .then(post => {
        const newComment = {
          text: req.body.text,
          name: req.body.name,
          avatar: req.body.avatar,
          user: req.user.id
        };

        // post içindeki comments dizisinin başıa yeni bir comment koyar
        post.comments.unshift(newComment);

        // güncelleme işlemleri
        post.save().then(post => res.json(post));
      })
      .catch(err => res.status(404).json({ postnotfound: "No post found" }));
  }
);

// @route   DELETE api/posts/comment/:id/:commend_id
// @desc    İçerik yorumunu siler.
// @access  Private => Gizli
router.delete(
  "/comment/:id/:comment_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Post.findById(req.params.id)
      .then(post => {
        // Yorum kontrolü
        if (
          post.comments.filter(
            comment => comment._id.toString() === req.params.comment_id
          ).length === 0
        ) {
          return res
            .status(404)
            .json({ commentnotexists: "Böyle bir yorum yoktur!" });
        }

        // Yorum varsa index bul
        const removeIndex = post.comments
          .map(item => item._id.toString())
          .indexOf(req.params.comment_id);

        // kaldır diziden
        post.comments.splice(removeIndex);

        //güncelle
        post.save().then(post => res.json(post));
      })
      .catch(err => res.status(404).json({ postnotfound: "No post found" }));
  }
);

module.exports = router;
