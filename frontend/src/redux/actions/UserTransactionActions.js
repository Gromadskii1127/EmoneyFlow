import * as actionTypes from 'redux/actionTypes';
import { USER_GET_TRANSACTION_LIST } from 'constant/urls'
import { format } from "date-fns";

export const getTransactionList = (openDrawer,keyword, filter, countPerPage, pageIndex, isCalc, payeeId) => (
  dispatch
) => {  
  var fromDateString = '', toDateString = '';
  if (openDrawer) {
    if (filter?.fromDate) {
      fromDateString = format(filter?.fromDate, 'yyyy-MM-dd');
    }
    if (filter?.toDate) {
      toDateString = format(filter?.toDate, 'yyyy-MM-dd');
    }
  }
  return dispatch({
    type: actionTypes.USER_GET_TRANSACTION_LIST,
    payload: {
      request: {
        url: `${USER_GET_TRANSACTION_LIST}?countPerPage=${countPerPage}&pageIndex=${pageIndex}&keyword=${keyword}&fromDate=${fromDateString}&toDate=${toDateString}&method=${filter?.method ? filter?.method.value : ''}&status=${filter?.status ? filter?.status.value : ''}&currency=${filter?.currency ? filter?.currency?.value : ''}&iscalc=${isCalc}&payeeId=${payeeId}`,
        method: 'GET',
      }
    }
  });
  
};

export const getTransaction = (id) => (dispatch) => {
  
};

export const UserTransactionActions = [];
