const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");

const users = require("./routes/api/users");
const profile = require("./routes/api/profile");
const posts = require("./routes/api/posts");

const app = express();

// Body Parse Middleware(Ara Katman) İşlemleri
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Database Config
const db = require("./config/keys").mongoURI;

mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log("Mongodb Bağlantısı Gerçekleştirildi"))
  .catch(() => console.log("Mongodb Bağlantı Hatası"));

// Passport Middleware (Passport Ara Katmanı)
app.use(passport.initialize());
// Passport Config (Passport Ayarları)
require("./config/passport")(passport);

app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/posts", posts);

const port = process.env.PORT | 5000;


app.listen(port, () => {
  console.log(`Sunucu şu anda şu portta çalışıyor : ${port}`);
});