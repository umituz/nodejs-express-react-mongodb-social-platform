import {
  MEVCUT_PROFIL,
  PROFIL_YUKLENIYOR,
  MEVCUT_PROFILI_KALDIR
} from "../actions/types";

const initialState = {
  profile: null,
  profiles: null,
  loading: false
};

export default (state = initialState, action) => {
  switch (action.type) {
    case PROFIL_YUKLENIYOR:
      return {
        ...state,
        loading: true
      };
    case MEVCUT_PROFIL:
      return {
        ...state,
        profile: action.payload,
        loading: false
      };
    case MEVCUT_PROFILI_KALDIR:
      return {
        ...state,
        profile: null
      };
    default:
      return state;
  }
};
