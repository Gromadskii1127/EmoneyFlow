import * as actionTypes from 'redux/actionTypes';
import { extend } from 'lodash';

const initialState = {
  upload: {
    isDisabled: true
  },
  summary: {
    timing: 'immediately'
  }
};

const PayeeUploadCsvReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.PAYEE_UPLOAD_CSV_SAVE_DATA:
      return extend({}, state, action.payload.data);
    case actionTypes.PAYEE_UPLOAD_CSV_FINISH:
      return {
        ...initialState,
        complete: {
          isLoading: false,
          canContinue: true
        }
      };
    default:
      return extend({}, state);
  }
};

export default PayeeUploadCsvReducer;
