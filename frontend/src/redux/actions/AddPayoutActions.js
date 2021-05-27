import { SUCCESS_SUFFIX } from 'constant';
import * as actionTypes from 'redux/actionTypes';

export const uploadData = (apiUrl) => (dispatch) => {
  setTimeout(() => {
    dispatch({
      type: actionTypes.ADD_PAYOUT_PERFORM_UPLOAD + SUCCESS_SUFFIX
    });

    dispatch({
      type: actionTypes.ADD_PAYOUT_SAVE_DATA,
      payload: {
        data: {
          fields: {},
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

export const saveData = (key, data) => (dispatch) => {
  return dispatch({
    type: actionTypes.ADD_PAYOUT_SAVE_DATA,
    payload: {
      data: {
        [key]: data
      }
    }
  });  
};

export const AddPayoutActions = [
  actionTypes.ADD_PAYOUT_SAVE_DATA
];
