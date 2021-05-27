import * as actionTypes from 'redux/actionTypes';
import { extend } from 'lodash';

const initialState = {};

const UploadCsvReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.ADD_PAYEE_SAVE_DATA:      
      return extend({}, state, action.payload.data);
    default:
      return extend({}, state);
  }
};

export default UploadCsvReducer;
