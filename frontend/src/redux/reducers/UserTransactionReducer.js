import * as actionTypes from 'redux/actionTypes';
import { SUCCESS_SUFFIX, ERROR_SUFFIX } from 'constant';
import _ from 'lodash';

const initialState = {
  listData: {
    list: [],
    totalCount: 0
  },
  selected: {},
};

const AdminTransactionReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.USER_GET_TRANSACTION_LIST:
      return { ...state };
    case actionTypes.USER_GET_TRANSACTION_LIST + SUCCESS_SUFFIX:      
      return _.extend({}, state, {
        listData: {
          list: action.payload.data?.data?.hits?.hits || [], 
          totalCount: action.payload.data?.totalCount || 0
        }
      });
      
    case actionTypes.USER_GET_TRANSACTION_LIST + ERROR_SUFFIX:
      return _.extend({}, state, {
        listData:{
          list:[],
          totalCount: 0
        }
      });
    case actionTypes.USER_GET_TRANSACTION + SUCCESS_SUFFIX:
      return _.extend({}, state, {
        selected: action.payload.data.selected
      });

    case actionTypes.USER_GET_TRANSACTION + ERROR_SUFFIX:
      return _.extend({}, state, {
        selected: {}
      });
    default: {
      return { ...state };
    }
  }
};

export default AdminTransactionReducer;
