import * as actionTypes from 'redux/actionTypes';
import { SUCCESS_SUFFIX, ERROR_SUFFIX } from 'constant';
import _ from 'lodash';
const initialState = {
  listData: {
    list: [],
    totalCount: 0
  },
  selected: {},
  isLoading: false,
  isListLoading: false,
  deletingState: 0,  
};
const AdminCompanyReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.ADMIN_COMPANY_GET_LIST:
      return _.extend({}, state, {
        isListLoading: true,
        listData: {
          list: [],
          totalCount: 0
        }
    })
    case actionTypes.ADMIN_COMPANY_GET_LIST + SUCCESS_SUFFIX:
      return _.extend({}, state, {
        listData: {
          list: action?.payload?.data?.list || [],
          totalCount: action?.payload?.data?.totalCount || 0
        },
        isListLoading: false
      });
    case actionTypes.ADMIN_COMPANY_GET_LIST + ERROR_SUFFIX:
      return _.extend({}, state, {
        isListLoading: false,
        listData : {
          list: [],
          totalCount: 0
        }
      })
    case actionTypes.ADMIN_COMPANY_GET:
      return _.extend({}, state, {
        isLoading: true
      });
    case actionTypes.ADMIN_COMPANY_GET + SUCCESS_SUFFIX:
      return _.extend({}, state, {
        isLoading: false,
        selected: action?.payload?.data || {}
      });
    case actionTypes.ADMIN_COMPANY_GET + ERROR_SUFFIX:
      return _.extend({}, state, {
        isLoading: false,
        selected: {}
      });
      case actionTypes.ADMIN_COMPANY_ADD_EDIT:
        return _.extend({}, state, {
          ...state,        
          isLoading: true,        
        });
    case actionTypes.ADMIN_COMPANY_ADD_EDIT + SUCCESS_SUFFIX:            
      return _.extend({}, state, {
        ...state,
        isLoading: false,               
      });
    case actionTypes.ADMIN_COMPANY_ADD_EDIT + ERROR_SUFFIX:
      return _.extend({}, state, {        
        isLoading: false,        
      });
    case actionTypes.ADMIN_COMPANY_DELETE:
      return _.extend({}, state, {
        deletingState: 1
      });
    case actionTypes.ADMIN_COMPANY_DELETE + SUCCESS_SUFFIX:      
    case actionTypes.ADMIN_COMPANY_DELETE + ERROR_SUFFIX:
      return _.extend({}, state, {
        deletingState: 2
      });
    default: {
      return { ...state };
    }
  }
}
export default AdminCompanyReducer;