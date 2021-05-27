import * as actionTypes from 'redux/actionTypes';
import { concat } from 'lodash';
const initialState = {
  list: []
};
const ErrorReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.ERROR_ADD: {
      return {
        list: concat(state.list, { type: action.payload.type, message: action.payload.message, translateType:action.payload.translateType  })
      }
    }
    case actionTypes.ERROR_REMOVE_FIRST:      
      return { 
        list: concat(state.list.slice(1))
      }
    default:
      return { ...state }
  }
};

export default ErrorReducer;