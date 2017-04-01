export const loginAction = user => ({
  type: 'LOGIN_ACTION',
  user
});

export const signupAction = user => ({
  type: 'SIGNUP_ACTION',
  user
});

export const createDocAction = document => ({
  type: 'CREATEDOC_ACTION',
  document
});
