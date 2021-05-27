import * as actionTypes from 'redux/actionTypes';
import { extend } from 'lodash';
import { ERROR_SUFFIX, SUCCESS_SUFFIX } from 'constant';

const initialState = {
  local: {

  }
};

const PayoutReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.PAYOUT_SAVE:
      return extend({}, state);
    case actionTypes.PAYOUT_SAVE + SUCCESS_SUFFIX:      
      return extend({}, state);
    case actionTypes.PAYOUT_SAVE + ERROR_SUFFIX:
      return extend({}, state);
    case actionTypes.PAYOUT_SAVE_LOCAL:
      return extend({}, state, {
        local: action.payload.data
      });
    default:
      return extend({}, state);
  }
};

export default PayoutReducer;
