import { checkStringEmpty } from 'utils/checkEmpty';

export const VALIDATORS = {
  email: { errorMessage: 'Invalid Email Address' },
  required: { errorMessage: 'Required' },
  match: { errorMessage: 'Not matched' },
  emailExists: { errorMessage: 'Email Aready Exists' },
  loginFail: { errorMessage: 'Username or password are not valids' }
};

export const VALIDATOR_METHODS = {
  email: value => {
    if (!/\S+@\S+\.\S+/.test(String(value).toLowerCase())) {
      return VALIDATORS['email'].errorMessage;
    } else {
      return null;
    }
  },
  required: value => {
    if (checkStringEmpty(value)) {
      return VALIDATORS['required'].errorMessage;
    } else {
      return null;
    }
  },
  match: (value1, value2) => {
    if (value1 !== value2) {
      return VALIDATORS['match'].errorMessage;
    } else {
      return null;
    }
  }
};
