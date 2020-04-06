import { MEVCUT_KULLANICI } from "../actions/types";
import isEmpty from "../validation/is_empty";

const initialState = {
  isAuthenticated: false,
  user: {}
};

export default function(state = initialState, action) {
  switch (action.type) {
    case MEVCUT_KULLANICI:
      return {
        ...state,
        isAuthenticated: !isEmpty(action.payload),
        user: action.payload
      };
    default:
      return state;
  }
}
