import * as actionTypes from 'redux/actionTypes';
import { ADMIN_USER, ADMIN_USER_MFA, ADMIN_USER_RESET }  from 'constant/urls';

export const getUserList = (keyword, countPerPage, pageNumber) => (dispatch) => {

  return dispatch({
    type: actionTypes.ADMIN_USER_GET_LIST,
    payload: {
      request: {
        url: `${ADMIN_USER}?countPerPage=${countPerPage}&pageIndex=${pageNumber}&keyword=${keyword}`,
        method: 'GET',
      }
    }
  })   
};

export const getUser = (id) => (dispatch) => {
  
}

export const editUser = ( id, newData, request = true ) => (dispatch) => {    
  newData['id'] = id.toString();  
  if (newData['timezone'] === null) {
    newData['timezone'] = '';
  }
  if (newData['companyId'] === null){
    newData['companyId'] = 0;
  }
  return dispatch({
    type: actionTypes.ADMIN_USER_EDIT,
    payload: {
      request: {
        url: ADMIN_USER,
        method: 'PUT',
        data: newData
      }
    }
  });
}
export const addUser = (id, newData) => (dispatch) => {

  return dispatch({
    type: actionTypes.ADMIN_USER_ADD,
    payload: {
      request: {
        url: ADMIN_USER,
        method: 'POST',
        data: newData
      }
    }
  });
}
export const resetPassword = (id) => (dispatch) => {
  return dispatch({
    type: actionTypes.ADMIN_USER_RESET,
    payload: {
      request: {
        url: ADMIN_USER_RESET,
        method: 'POST',
        data: {
          id: id
        }
      }
    }
  })
}
export const deleteUser = (id) => (dispatch) => {  
  return dispatch({
    type: actionTypes.ADMIN_USER_DELETE,
    payload: {
      request: {
        url: `${ADMIN_USER}/?id=${id}?`,
        method: 'DELETE',
        data: {
          id: id
        }
      }
    }
  })
}

export const setMFA = (id, status) => (dispatch) => {
  return dispatch({
    type: actionTypes.ADMIN_USER_DELETE,
    payload: {
      request: {
        url: ADMIN_USER_MFA,
        method: 'POST',
        data: {
          id: id,
          status: status
        }
      }
    }
  })
}
export const AdminUserActions = [];