import { HATALARI_YAKALA } from "../actions/types";

const initialState = {};

export default function(state = initialState, action) {
  switch (action.type) {
    case HATALARI_YAKALA:
      return action.payload;
    default:
      return state;
  }
}
