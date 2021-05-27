export const deepClone = (obj) => JSON.parse(JSON.stringify(obj));

export const getArrayLength = (array) => (array || []).length;

export const arrayAverage = (array) =>
  array.reduce((a, b) => a + b) / getArrayLength(array);

/**
 *
 * @param {*} objArray: array of objects
 * @param {*} fields: array of properties of object
 * @param {*} func: merge function
 * @return merged object for given properties
 *
 * ex:
 * const a = [{a: 1, b: 2, c: 3}, {a: 2, b: 3, c: 4}]
 * mergeArrayOfObjects(a, ['a', 'b'], arrayAverage)
 * Result should be: {a: 1.5, b: 2.5}
 */
export const mergeArrayOfObjects = (objArray, fields = [], func = null) => {
  const newObj = {};

  fields.forEach((field) => {
    newObj[field] = func(objArray.map((item) => item[field]) || []);
  });

  return newObj;
};

export const replaceElement = (
  objects,
  fieldId,
  fieldValue,
  updatedFieldName,
  newData
) => {
  for (var i = 0; i < objects.length; i++) {
    if (objects[i][fieldId] === fieldValue) {
      objects[i][updatedFieldName] = newData;
      return objects;
    }
  }
  return objects;
};

export const getDataInArray = (objects, fieldId, fieldValue) => {
  for (var i = 0; i < objects.length; i++) {
    if (objects[i][fieldId] === fieldValue) {
      return objects[i];
    }
  }
  return null;
};

export const getIndexInArray = (objects, fieldId, fieldValue) => {
  for (var i = 0; i < objects.length; i++) {
    if (objects[i][fieldId] === fieldValue) {
      return i;
    }
  }
  return -1;
};

export const checkErrorObjValidated = (error) => {
  const keys = Object.keys(error);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];

    if (error[key]) return false;
  }

  return true;
};
