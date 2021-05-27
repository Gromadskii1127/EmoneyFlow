import { isEmail } from 'validator';
import { isValid } from 'iban';

const Required = (value) => {
  if ((!value && value !== 0) || (typeof value === 'string' && value === '')) {
    return 'errors.required';
  }
};

const Email = (value) => {
  if (!isEmail(value)) {
    return 'errors.email';
  }
};

const Iban = (value) => {
  if (!isValid(value)) {
    return 'errors.iban';
  }
};

const Bic = (value) => {
  if (!/^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/.test(value)) {
    return 'errors.bic'
  }
}
export { Required, Email, Iban, Bic };
