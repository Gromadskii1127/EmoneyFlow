import * as actionTypes from 'redux/actionTypes';
import { ADMIN_COMPANY } from 'constant/urls'

export const getCompanyList = (keyword, countPerPage, pageNumber) => (dispatch) => {
  return dispatch({
    type: actionTypes.ADMIN_COMPANY_GET_LIST,
    payload: {
      request: {
        url: `${ADMIN_COMPANY}?countPerPage=${countPerPage}&pageIndex=${pageNumber}&keyword=${keyword}`,
        method: 'GET',
      }
    }
  });  
};

export const getCompany = (id) => (dispatch) => {
  return dispatch({
    type: actionTypes.ADMIN_COMPANY_GET,
    payload: {
      request: {
        url: `${ADMIN_COMPANY}/${id}`,
        method: 'GET',
      }
    }
  });
}

export const addCompany = (companyInfo) => (dispatch) => {
  return dispatch({
    type: actionTypes.ADMIN_COMPANY_ADD_EDIT,
    payload: {
      request: {
        url: ADMIN_COMPANY,
        method: 'POST',
        data: companyInfo
      }
    }
  });
}
export const updateCompany = (companyInfo) => (dispatch) => {
  for(var i = 0 ; i < companyInfo.apis.length; i++){
    companyInfo.apis[i]["id"] = companyInfo.apis[i]["id"].toString();
    companyInfo.apis[i]["amount"] = companyInfo.apis[i]["amount"].toString();
    companyInfo.apis[i]["apiType"] = companyInfo.apis[i]["apiType"].toString();
    if (companyInfo.apis[i]["companyId"]) {
      companyInfo.apis[i]["companyId"] = companyInfo.apis[i]["companyId"].toString();
    }    
    
  }
  for(i = 0 ; i < companyInfo.users.length; i++){
    companyInfo.users[i]["id"] = companyInfo.users[i]["id"].toString();
    if (companyInfo.users[i]["timezone"] === null){
      companyInfo.users[i]["timezone"] = "";
    }
  }
  return dispatch({
    type: actionTypes.ADMIN_COMPANY_ADD_EDIT,
    payload: {
      request: {
        url: ADMIN_COMPANY,
        method: 'PUT',
        data: companyInfo
      }
    }
  });
}
export const deleteCompany = (id) => (dispatch) => {
  return dispatch({
    type: actionTypes.ADMIN_COMPANY_DELETE,
    payload: {
      request: {
        url: `${ADMIN_COMPANY}/?id=${id}`,
        method: 'DELETE', 
        data: {
          id: id
        }       
      }
    }
  });
}
export const AdminCompanyActions = [];