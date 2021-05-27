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
const AdminUserReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.ADMIN_USER_GET_LIST:
      return { ...state }
    case actionTypes.ADMIN_USER_GET_LIST + SUCCESS_SUFFIX:
      return _.extend({}, state, {
        listData: {
          list: action?.payload?.data?.list || [],
          totalCount: action?.payload?.data?.totalCount || 0
        }
      });
    case actionTypes.ADMIN_USER_GET_LIST + ERROR_SUFFIX:
      return _.extend({}, state, {
        list: []
      });
    case actionTypes.ADMIN_USER_GET + SUCCESS_SUFFIX:
      return _.extend({}, state, {
        selected: action?.payload?.data?.selected || {}
      });

    case actionTypes.ADMIN_USER_GET + ERROR_SUFFIX:
      return _.extend({}, state, {
        selected: {}
      });
    case actionTypes.ADMIN_USER_EDIT + SUCCESS_SUFFIX:            
      if (action?.payload?.status === 200) {
        var index = _.findIndex(state.listData.list, function(o) { return o.id.toString() === action.payload.data.original; });      
        const list = state.listData.list;
        list.splice(index, 1, action?.payload?.data?.user);
        return _.extend({}, state, {
          listData: {
            list: list,
            totalCount: state.listData.totalCount
          }
        });
      } else {
        return state;
      }
      
    case actionTypes.ADMIN_USER_DELETE:
      return { ...state }
    case actionTypes.ADMIN_USER_DELETE + SUCCESS_SUFFIX:
      return { ...state }
    case actionTypes.ADMIN_USER_DELETE + ERROR_SUFFIX:
      return { ...state }
    case actionTypes.ADMIN_USER_RESET:
      return { ...state}
    case actionTypes.ADMIN_USER_RESET + SUCCESS_SUFFIX:
      return { ...state}
    case actionTypes.ADMIN_USER_RESET + ERROR_SUFFIX:
      return { ...state}
    default: {
      return { ...state };
    }
  }
}
export default AdminUserReducer;