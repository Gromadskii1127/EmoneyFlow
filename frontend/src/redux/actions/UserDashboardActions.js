import * as actionTypes from 'redux/actionTypes';
import { USER_DASHBOARD_GET_KPIS, USER_DASHBOARD_GET_DEBITS, USER_DASHBOARD_GET_BALANCE, USER_DASHBOARD_GET_TOP_PAYEES, USER_DASHBOARD_GET_FEES } from 'constant/urls'
import { format } from "date-fns";

export const getDashboardKpis = () => (dispatch) => {
  return dispatch({
    type: actionTypes.USER_DASHBOARD_GET_KPIS,
    payload: {
      request: {
        url: USER_DASHBOARD_GET_KPIS,
        method: 'GET',
      }
    }
  });
};

export const getDashboardDebits = (fromDate, toDate) => (dispatch) => {
  return dispatch({
    type: actionTypes.USER_DASHBOARD_GET_DEBITS,
    payload: {
      request: {
        url: `${USER_DASHBOARD_GET_DEBITS}/?fromDate=${format(fromDate, 'yyyy-MM-dd')}&toDate=${format(toDate, 'yyyy-MM-dd')}`,
        method: 'GET',
      }
    }
  });
};

export const getDashboardBalance = () => (dispatch) => {
  return dispatch({
    type: actionTypes.USER_DASHBOARD_GET_BALANCE,
    payload: {
      request: {
        url: USER_DASHBOARD_GET_BALANCE,
        method: 'GET',
      }
    }
  });

};

export const getDashboardTopPayees = (count, days) => (dispatch) => {

  return dispatch({
    type: actionTypes.USER_DASHBOARD_GET_TOP_PAYEES,
    payload: {
      request: {
        url: `${USER_DASHBOARD_GET_TOP_PAYEES}/?count=${count}&days=${days.days}`,
        method: 'GET',        
      }
    }
  });

};

export const getDashboardFees = (count, days) => (dispatch) => {
  console.log('days = ', days)
  return dispatch({
    type: actionTypes.USER_DASHBOARD_GET_FEES,
    payload: {
      request: {
        url: `${USER_DASHBOARD_GET_FEES}/?count=${count}&days=${days.days}`,
        method: 'GET',
        data: {
          count: count,
          days: days.days
        }
      }
    }
  });
  
};