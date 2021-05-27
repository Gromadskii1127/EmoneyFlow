import { SUCCESS_SUFFIX } from 'constant';
import * as actionTypes from 'redux/actionTypes';

export const saveData = (key, data) => (dispatch) => {
  console.log('save payout data ')
  let overwrites = {};
  if (key !== 'complete') {
    overwrites.summary = null;
  }

  dispatch({
    type: actionTypes.PAYOUT_UPLOAD_CSV_SAVE_DATA,
    payload: {
      data: {
        ...overwrites,
        [key]: data
      }
    }
  });
  return {[key]: {}};
};

export const uploadData = (apiUrl) => (dispatch) => {
  setTimeout(() => {
    dispatch({
      type: actionTypes.PAYOUT_UPLOAD_CSV_PERFORM_UPLOAD + SUCCESS_SUFFIX
    });

    dispatch({
      type: actionTypes.PAYOUT_UPLOAD_CSV_SAVE_DATA,
      payload: {
        data: {
          upload: {isDisabled: true},
          fields: {},
          summary: {},
          complete: {
            isLoading: false,
            canContinue: true
          }
        }
      }
    });
  }, 2000);

  return {complete: {canContinue: false}};
};

export const UploadCsvActions = [
  actionTypes.PAYOUT_UPLOAD_CSV_SAVE_DATA
];
