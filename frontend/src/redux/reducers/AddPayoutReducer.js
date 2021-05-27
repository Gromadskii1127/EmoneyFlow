import * as actionTypes from 'redux/actionTypes';
import { extend } from 'lodash';

const initialState = {
};

const AddPayoutReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.ADD_PAYOUT_SAVE_DATA:     {
      console.log('data = ', action.payload.data)
      return extend({}, state, action.payload.data);
    } 
      
    
    case actionTypes.ADD_PAYOUT_REMOVE_DATA:
      return extend({}, state);    
    default:
      return extend({}, state);
  }
};

export default AddPayoutReducer;