import * as actionTypes from 'redux/actionTypes';
import { SUCCESS_SUFFIX, ERROR_SUFFIX } from 'constant';
import _ from 'lodash';
const initialState = {
  listData: {
    list: [],
    totalCount: 0,
    calcAmount: {}
  },
  selected: {},
};

const AdminTransactionReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.ADMIN_GET_TRANSACTION_LIST:
      return { ...state };
    case actionTypes.ADMIN_GET_TRANSACTION_LIST + SUCCESS_SUFFIX:      
      if (action.payload?.status === 200) {
        return _.extend({}, state, {
          listData: {
            list: action.payload.data?.data?.hits?.hits || [], 
            totalCount: action.payload.data?.totalCount || 0 ,
            calcAmount: action.payload.data?.calcAmount || {}
          }
        });
      } else {
        return { ...state }
      }
      
      
    case actionTypes.ADMIN_GET_TRANSACTION_LIST + ERROR_SUFFIX:
      return _.extend({}, state, {
        listData:{
          list:[],
          totalCount: 0,
          calcAmount: {}
        }
      });
    case actionTypes.ADMIN_GET_TRANSACTION + SUCCESS_SUFFIX:
      return _.extend({}, state, {
        selected: action.payload.data.selected
      });

    case actionTypes.ADMIN_GET_TRANSACTION + ERROR_SUFFIX:
      return _.extend({}, state, {
        selected: {}
      });
    default: {
      return { ...state };
    }
  }
};

export default AdminTransactionReducer;
