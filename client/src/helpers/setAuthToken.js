import axios from "axios";

const setAuthToken = token => {
  if (token) {
    // Her istekte token'i Authorization'a ata
    axios.defaults.headers.common["Authorization"] = token;
  } else {
    // Token yoksa header Authorization değerini sil.
    delete axios.defaults.headers.common["Authorization"];
  }
};

export default setAuthToken;
