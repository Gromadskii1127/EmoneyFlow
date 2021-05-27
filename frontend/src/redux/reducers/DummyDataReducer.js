import * as actionTypes from 'redux/actionTypes';

const initialData = {
  data: {}
};

const DummyDataReducer = (state = initialData, action) => {
  switch (action.type) {
    case actionTypes.SET_DUMMY_DATA: {
      return {
        ...state,
        data: action.payload.data
      };
    }
    default: {
      return {
        ...state
      };
    }
  }
};

export default DummyDataReducer;
