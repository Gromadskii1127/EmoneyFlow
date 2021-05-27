export const checkStringEmpty = str => {
  return !(typeof str === 'string' && (str || '').length > 0);
};

export const checkObjectEmtpy = obj => {
  return obj === undefined || (Object.keys(obj) || []).length === 0;
};

export const checkArrayEmpty = array => {
  return !array || (Array.isArray(array) && (array || []).length === 0);
};

export const checkErrorEmpty = errorValue => {
  const names = Object.keys(errorValue) || [];
  for (let i = 0; i < (names || []).length; i++) {
    if (errorValue[names[i]]) {
      return false;
    }
  }
  return true;
};
