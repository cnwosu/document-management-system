import { Map } from 'immutable';

import actionTypes from '../actions/actionTypes';
// import { loginAction } from '../actions';

const initialState = new Map();

export default function rootReducer(state = initialState, action) {
  switch (action && action.type) {
    case actionTypes.NEW_ACTION:
      return state.set('isLoggedIn', action.isLoggedIn);
    case actionTypes.loginAction:
      return state.set('isLoggedIn', action.isLoggedIn);
    case actionTypes.signupAction:
      return state.set('isLoggedIn', action.isLoggedIn);
    case actionTypes.createDocAction:
      return state.set('documentCreated', action.documentCreated);
    default:
      return state;
  }
}
