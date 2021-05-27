import { SUCCESS_SUFFIX } from 'constant';
import * as actionTypes from 'redux/actionTypes';
import { USER_PAYEE_DELETE, USER_PAYEE_LIST, USER_PAYEE_SAVE, USER_PAYEE_GET_BY_ID } from 'constant/urls';
import Fuse from 'fuse.js';
import {
  map,
  each,
  first,
  split,
  slice,
  join
} from 'lodash';

export const fetchPayeeList = (keyword, countPerPage, pageNumber) => (dispatch) => {
  return dispatch({
    type: actionTypes.PAYEE_LIST,
    payload: {
      request: {
        url: `${USER_PAYEE_LIST}?countPerPage=${countPerPage}&pageIndex=${pageNumber}&keyword=${keyword}`,
        method: 'GET',
      }
    }
  });
};

export const fetchPayeeDetails = (id) => (dispatch) => {
  return dispatch({
    type: actionTypes.PAYEE_DETAILS,
    payload: {
      request: {
        url: USER_PAYEE_GET_BY_ID + id,
        method: 'GET',        
      }
    }
  });
};

export const unsetPayeeDetails = () => (dispatch) => {
  dispatch({
    type: actionTypes.PAYEE_UNSET_DETAILS,
    payload: {
      data: {
        details: null
      }
    }
  });
};

export const searchPayeeList = (search) => (dispatch, getState) => {
  let list = getState().payee?.all;

  if (search) {
    const options = {
      includeScore: false,
      // Search in `author` and in `tags` array
      keys: ['name', 'firstName', 'lastName', 'iban', 'affiliateId']
    };
    const fuse = new Fuse(getState().payee?.all || [], options);
    const result = fuse.search(search);
    list = map(result, (r) => r.item);
  }

  dispatch({
    type: actionTypes.PAYEE_LIST + SUCCESS_SUFFIX,
    payload: {
      data: {
        search,
        list
      }
    }
  });
};

export const addPayees = (payees) => (dispatch, getState) => {
  each(payees, (p) => {
    if (!p.name) {
      p.name = p.name || p.firstName + ' ' + p.lastName;
    } else {
      const names = split(p.name, ' ');
      p.firstName = first(names);
      p.lastName = join(slice(names, 1), ' ');
    }
    p.id = Math.random().toString();
    p.paymentMethod = p.paymentMethod || 'SEPA';
  });

  return new Promise((resolve) => {
    setTimeout(() => {
      const all = getState().payee?.all;
      const list = getState().payee?.list;

      dispatch({
        type: actionTypes.PAYEE_LIST + SUCCESS_SUFFIX,
        payload: {
          data: {
            list: [...list, ...payees],
            all: [...all, ...payees]
          }
        }
      });
      resolve();
    }, 2000);
  });
};

export const savePayee = (payee) => (dispatch) => {
  return dispatch({
    type: actionTypes.PAYEE_SAVE,
    payload: {
      request: {
        url: USER_PAYEE_SAVE,
        method: 'POST',
        data: payee
      }
    }
  });
};

export const deletePayee = (payee) => (dispatch, getState) => {

  return dispatch({
    type: actionTypes.PAYEE_DELTE,
    payload: {
      request: {
        url: USER_PAYEE_DELETE,
        method: 'DELETE',
        data: {
          id: payee.id
        }
      }
    }
  });
};

export const PayeeActions = [
  actionTypes.PAYEE_LIST + SUCCESS_SUFFIX,
  actionTypes.PAYEE_UNSET_DETAILS,
  actionTypes.PAYEE_DETAILS + SUCCESS_SUFFIX
];
