export const UserType = {
  Admin : 3,
  Customer : 2,
  User : 1,
  None: 0
};
Object.freeze(UserType);

export const AuthenticationFormType = {
  Signin : 0,
  Otp: 1,
  Forgot: 2,
  ForgotSuccess: 3,
  NewPassword: 4,
}
Object.freeze(AuthenticationFormType);


export const DialogButtonType = {
  YES: {
    type: 0,
    text: 'emoney.yes'
  },
  NO: {
    type: 1,
    text: 'emoney.no'
  },
  OK: {
    type: 2,
    text: 'emoney.ok'
  }
}