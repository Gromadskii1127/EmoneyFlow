import * as actionTypes from 'redux/actionTypes';
import { ADMIN_GET_TRANSACTION_LIST } from 'constant/urls'
import { getTimezoneOffset } from "date-fns-tz";



export const getTransactionList = (openDrawer, keyword, filter, countPerPage, pageIndex, isCalc, timezone) => (
  dispatch
) => {
  var fromDateString = '', toDateString = '';
  const result = getTimezoneOffset(timezone || Intl.DateTimeFormat().resolvedOptions().timeZone) / (60 * 1000);
  if (openDrawer) {
    if (filter?.fromDate) {
      const currentOffset = filter?.fromDate.getTimezoneOffset();            
      const lastDate = new Date(filter.fromDate.getTime() + result - currentOffset);
      fromDateString =  lastDate.toISOString().substring(0, 10);
    }
    if (filter?.toDate) {
      const currentOffset = filter?.toDate.getTimezoneOffset();            
      const lastDate = new Date(filter.toDate.getTime() + result - currentOffset);
      toDateString =  lastDate.toISOString().substring(0, 10);
    }
  }
  return dispatch({
    type: actionTypes.ADMIN_GET_TRANSACTION_LIST,
    payload: {
      request: {
        url: `${ADMIN_GET_TRANSACTION_LIST}?countPerPage=${countPerPage}&pageIndex=${pageIndex}&keyword=${keyword}&fromDate=${fromDateString}&toDate=${toDateString}&method=${filter?.method ? filter?.method?.value : ''}&status=${filter?.status ? filter?.status?.value : ''}&currency=${filter?.currency ? filter?.currency?.value : ''}&isCalc=${isCalc}`,
        method: 'GET',
      }
    }
  });

};

export const getTransaction = (id) => (dispatch) => {

};

export const AdminTransactionActions = [];
