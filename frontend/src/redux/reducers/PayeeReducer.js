import * as actionTypes from 'redux/actionTypes';
import { ERROR_SUFFIX, SUCCESS_SUFFIX } from 'constant';
import { extend, omit } from 'lodash';

const initialState = {
  listData: {
    list: [],
    totalCount: 0
  },
  payeeData: {
    isLoading: false,
    list: []
  }
};

const PayeeReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.PAYEE_LIST + SUCCESS_SUFFIX:
      return extend({}, state, {
        listData: {
          list: action.payload?.data?.list || [],
          totalCount: action?.payload?.data?.totalCount || 0
        }
      })
    case actionTypes.PAYEE_DETAILS:
      return {
        ...omit(state, 'details')
      };
    case actionTypes.PAYEE_DETAILS + SUCCESS_SUFFIX:
      return extend({}, state, {
        details: action.payload?.data || {}
      });
    case actionTypes.PAYEE_DETAILS + ERROR_SUFFIX:
      return {
        ...omit(state, 'details')
      };
    case actionTypes.PAYEE_UNSET_DETAILS:
      return {
        ...omit(state, 'details')
      };
    case actionTypes.PAYEE_LIST + ERROR_SUFFIX:
      return extend({}, state);
    case actionTypes.PAYEE_SAVE:
      return extend({}, state, {
      })
    case actionTypes.PAYEE_SAVE + SUCCESS_SUFFIX:
      return {
        ...state,

      }
    default:
      return extend({}, state);
  }
};

export default PayeeReducer;
