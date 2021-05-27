import * as actionTypes from 'redux/actionTypes';

export const setDummyData = data => dispatch => {
  return dispatch({
    type: actionTypes.SET_DUMMY_DATA,
    payload: {
      data : {}
    }
  });
};

export const DummyDataActions = [actionTypes.SET_DUMMY_DATA];
