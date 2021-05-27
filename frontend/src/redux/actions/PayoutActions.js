import * as actionTypes from 'redux/actionTypes';
import { USER_PAYOUT } from 'constant/urls';

export const executePaymentByUpload = (payouts, option) => (dispatch) => {
  payouts.forEach(element => {
    if (element['reference'] === '') {
      element['reference'] = option?.reference || '';
    }
    element['dateType'] = option.dateType;
    element['dateValue'] = option.dateValue;
    //element['payeeId'] = element['id'];
  });
  return dispatch({
    type: actionTypes.PAYOUT_SAVE,
    payload: {
      request: {
        url: USER_PAYOUT,
        method: 'POST',
        data: payouts
      }
    }
  });
};

export const savePayouts = (payouts, option) => (dispatch) => {
  console.log('payouts = ', payouts, option);
  dispatch({
    type: actionTypes.PAYOUT_SAVE_LOCAL,
    payload: {
      data: {
        list: payouts,
        option: option
      }
    }
  })
}
