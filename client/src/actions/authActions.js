import axios from "axios";
import { HATALARI_YAKALA, MEVCUT_KULLANICI } from "./types";
import setAuthToken from "../helpers/setAuthToken";
import jwt_decode from "jwt-decode";

// Kullanıcı Kaydetme
export const registerUser = (userData, history) => dispatch => {
  axios
    .post("/api/users/register", userData)
    .then(res => history.push("/login"))
    .catch(err =>
      // redux-thunk metodu.
      dispatch({
        type: HATALARI_YAKALA,
        payload: err.response.data
      })
    );
};

// Giriş Yaptıktan Sonra Kullanıcı Bilgilerini Alma
export const loginUser = userData => dispatch => {
  axios
    .post("/api/users/login", userData)
    .then(res => {
      // Oluşan tokunu al.
      const { token } = res.data;
      // localstorage kullanıcı bilgilerinin bulunduğu token'i kaydet
      localStorage.setItem("jwtToken", token);
      // token'i headers'a kaydet. setAuthToken() kendi fonksiyonumuz
      setAuthToken(token);
      // Token'i çözmek için jwt-decode paketini kullandık.
      const decoded = jwt_decode(token);
      // Mevcut kullanıcıyı ayarla.
      dispatch(setCurrentUser(decoded));
    })
    .catch(err =>
      // redux-thunk metodu.
      dispatch({
        type: HATALARI_YAKALA,
        payload: err.response.data
      })
    );
};

// Oturum açan kullanıcıyı bul
export const setCurrentUser = decoded => {
  return {
    type: MEVCUT_KULLANICI,
    payload: decoded
  };
};

// Oturumu sonlandır
export const logoutUser = () => dispatch => {
  // LocalStorage'dan token'i kaldır
  localStorage.removeItem("jwtToken");
  // Header Authorization kısmından token'i kaldır diğer istekler için
  setAuthToken(false);
  // MEVCUT_KULLANICI'nın user değerini boş nesneye çevir ve isAuthenticated'i false çevir.
  dispatch(setCurrentUser({}));
};
