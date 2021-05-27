import * as actionTypes from 'redux/actionTypes';

export const saveData = (key, data) => (dispatch) => {  
  return dispatch({
    type: actionTypes.ADD_PAYEE_SAVE_DATA,
    payload: {
      data: {
        [key]: data
      }
    }
  });  
};
export const finish = () => (dispatch) => {
  dispatch({
    type: actionTypes.ADD_PAYEE_SAVE_DATA,
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
};

export const AddPayeeActions = [actionTypes.ADD_PAYEE_SAVE_DATA];
