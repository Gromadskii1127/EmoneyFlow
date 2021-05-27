import * as actionTypes from 'redux/actionTypes';
export const addError = ({type, message, fromType, translateType = true}) => (dispatch) => {  
  dispatch({
    type: actionTypes.ERROR_ADD,
    payload: {
      type: type,
      message: message,
      translateType: translateType
    }
  })
}

export const removeError = () => (dispatch) => {  
  dispatch({
    type: actionTypes.ERROR_REMOVE_FIRST
  });
}

