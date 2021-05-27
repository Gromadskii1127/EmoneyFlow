import * as actionTypes from 'redux/actionTypes';
import { extend } from 'lodash';

const initialState = {
  upload: {
    isDisabled: true
  }
};

const PayoutUploadCsvReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.PAYOUT_UPLOAD_CSV_SAVE_DATA:   
      console.log('PAYOUT_UPLOAD_CSV_SAVE_DATA =', action.payload.data, state)   ;
      return  extend({}, state, action.payload.data);
    default:
      return extend({}, state);
  }
};

export default PayoutUploadCsvReducer;