import * as actionTypes from 'redux/actionTypes';

export const saveData = (key, data) => (dispatch) => {
  dispatch({
    type: actionTypes.PAYEE_UPLOAD_CSV_SAVE_DATA,
    payload: {
      data: {
        complete: null,
        [key]: data
      }
    }
  });
  return { [key]: {} };
};

export const finish = () => (dispatch) => {
  dispatch({
    type: actionTypes.PAYEE_UPLOAD_CSV_FINISH
  });
};

export const PayeeUploadCsvActions = [
  actionTypes.PAYEE_UPLOAD_CSV_SAVE_DATA,
  actionTypes.PAYEE_UPLOAD_CSV_FINISH
];
