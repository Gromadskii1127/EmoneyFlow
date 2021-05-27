import * as actionTypes from 'redux/actionTypes';
import { SUCCESS_SUFFIX, ERROR_SUFFIX, ENUMS } from 'constant';
import { extend } from 'lodash';
const initialState = {
  isAuthorized: false,
  subscription: {},
  isLoading: false,
  isUpdating: false,
  userType: ENUMS.UserType.None,
  firstName: '',
  lastName: '',
  email: '',
  mfaEnabled: false,
  accessToken: '',
  authToken: '',
  apiKey: '',
  info: {

  },
  isLoggedout: false
};

const UserReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.USER_LOGIN + SUCCESS_SUFFIX: {

      return {
        ...state,
        isAuthorized: true,
        userType:
          action.payload.userType === '1'
            ? ENUMS.UserType.Admin
            : ENUMS.UserType.User,
        firstName: action.payload.firstName,
        lastName: action.payload.lastName,
        email: action.payload.email,
        mfaEnabled: action.payload.mfaEnabled,
        accessToken: action.payload.accessToken,
        authToken: action.payload.authToken,
        apiKey: action.payload.apiKey
      };
    }
    case actionTypes.USER_OTP_CHECK + SUCCESS_SUFFIX: {
      return { ...state, isAuthorized: true };
    }
    case actionTypes.USER_SET_USERNAME: {
      return { ...state, userName: action.payload.data };
    }

    case actionTypes.USER_LOGIN + ERROR_SUFFIX: {
      return { ...state, isAuthorized: false };
    }

    case actionTypes.USER_LOGOUT: {
      return { ...state, isAuthorized: false, userType: ENUMS.UserType.None };
    }
    case actionTypes.USER_LOGGED_OUT: {
      return { ...state, isLoggedout: true };
    }
    case actionTypes.USER_UPDATE_INFO:
      return extend({}, state, {
        isUpdating: true,
      })
    case actionTypes.USER_GET_INFO:
      return extend({}, state, {
        isLoading: true
      })
    case actionTypes.USER_UPDATE_INFO + SUCCESS_SUFFIX:
      if (action.payload?.status === 200) {
        return extend({}, state, {
          isUpdating: false,
          isLoading: false,
          info: action.payload?.data || {},
          firstName: action.payload?.data?.firstName || '',
          lastName: action.payload?.data?.lastName || '',
          email: action.payload?.data?.email || '',
        });
      } else {
        return extend({}, state, {
          isUpdating: false,
          isLoading: false
        });
      }


    case actionTypes.USER_GET_INFO + SUCCESS_SUFFIX: {
      return extend({}, state, {
        isLoading: false,
        isUpdating: false,
        info: action.payload?.data || {},
        firstName: action.payload?.data?.firstName || '',
        lastName: action.payload?.data?.lastName || '',
        email: action.payload?.data?.email || '',
      });
    }
    case actionTypes.USER_UPDATE_INFO + ERROR_SUFFIX:
      return extend({}, state, {
        isUpdating: false,
        isLoading: false
      });
    case actionTypes.USER_GET_INFO + ERROR_SUFFIX:
      return extend({}, state, {
        isLoading: false,
        isUpdating: false,
        info: state.info
      });
    case actionTypes.USER_ENABLED_MFA:
      return extend({}, state, {
        mfaEnabled: action.payload.value
      })
    default: {
      return { ...state };
    }
  }
};

export default UserReducer;
