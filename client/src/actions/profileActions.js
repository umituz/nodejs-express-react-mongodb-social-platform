import axios from "axios";

import {
  MEVCUT_PROFIL,
  PROFIL_YUKLENIYOR,
  MEVCUT_PROFILI_KALDIR,
  HATALARI_YAKALA
} from "./types";

// Giriş yapan kullanıcının profil bilgilerini getir.
export const getCurrentProfile = () => dispatch => {
  dispatch(setProfileLoading);
  axios
    .get("/api/profile")
    .then(res =>
      dispatch({
        type: MEVCUT_PROFIL,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: MEVCUT_PROFIL,
        payload: {}
      })
    );
};

// Profil yüklenip yüklenmediğini sorgular.
export const setProfileLoading = () => {
  return {
    type: PROFIL_YUKLENIYOR
  };
};

// Kullanıcı çıkış yaptığında profile state'ini temizle
export const clearCurrentProfile = () => {
  return {
    type: MEVCUT_PROFILI_KALDIR
  };
};

// Kullanıcının profilini oluşturur.
export const createProfile = (profileData, history) => dispatch => {
  axios
    .post("/api/profile", profileData)
    .then(res => history.push("/dashboard"))
    .catch(err =>
      dispatch({
        type: HATALARI_YAKALA,
        payload: err.response.data
      })
    );
};
