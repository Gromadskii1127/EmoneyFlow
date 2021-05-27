import { createStore, compose, applyMiddleware, combineReducers } from 'redux';
// storages
import * as storage from 'redux-storage';
import createEngine from 'redux-storage-engine-localstorage';
import filter from 'redux-storage-decorator-filter';
//
import axios from 'axios';
import qs from 'qs';
import settings from 'config/settings';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import axiosMiddleware from 'redux-axios-middleware';
import * as reducers from 'redux/reducers';
// Actions
import { addError } from 'redux/actions/ErrorActions';
import { DummyDataActions } from 'redux/actions/DummyDataActions';
import { UserActions, logout } from 'redux/actions/UserActions';
import { PayeeUploadCsvActions } from 'redux/actions/PayeeUploadCsvActions';
import { AddPayeeActions } from 'redux/actions/AddPayeeActions';
import { AddPayoutActions } from 'redux/actions/AddPayoutActions';
import { PayeeActions } from 'redux/actions/PayeeActions';

// middlewares
const logger = createLogger({
  collapsed: true
});
const client = axios.create({
  baseURL: settings.url,
  responseType: 'json',
  paramsSerializer: (params) => qs.stringify(params, { indicies: false })
});

// storage middleware
const userEngine = createEngine('user');
// persist only these state keys to localStorage
const engine = filter(userEngine, [
  'user',
  'dummy',
  'payeeUploadCsv',
  'addPayee',
  'payee'
]);
export const loadStateFromStorage = storage.createLoader(engine);
const storageMiddleware = storage.createMiddleware(
  engine,
  [],
  [
    ...UserActions,
    ...PayeeUploadCsvActions,
    ...AddPayeeActions,
    ...DummyDataActions,
    ...PayeeActions,
    ...AddPayoutActions
  ]
);

// reducers
const rootReducer = storage.reducer(
  combineReducers({
    ...reducers
  })
);
const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const middlewareConfig = {
  interceptors: {
    request: [
      async function ({ getState, dispatch }, config) {
        const userInfo = getState().user;
        config.headers = {
          'X-Api-Key': userInfo?.apiKey,
          'Authorization': userInfo?.authToken,
          'X-Amz-Security-Token': userInfo?.accessToken,
          'Content-Type': "application/json",
        };
        return config;
      }
    ],
    response: [{
      success: function ({ getState, dispatch, getSourceAction }, req) {
        console.log('request success');
        return req;
      },
      error: function ({ getState, dispatch, getSourceAction }, req) { 
        console.log('request error');
        if (getState().user.isAuthorized && req?.response.status === 401) {
          dispatch(logout());
        } else {
          if (typeof req?.response?.data === 'string') {
            dispatch(addError({ type: 0, message: req?.response?.data, from: '', translateType: false }));
            return req;
          }
          if (getState().user.isAuthorized && req?.response.status === 403) {
            dispatch(addError({ type: 0, message: 'api.error.code.403', from: '', translateType: true }));
            // dispatch(addError({ type: 0, message: req.response?.data?.message, from: '', translateType: false }));
          } else if (getState().user.isAuthorized && req?.response.status === 400) {
            dispatch(addError({ type: 0, message: 'api.error.code.400', from: '', translateType: true }));
            // dispatch(addError({ type: 0, message: req.response?.data?.message, from: '', translateType: false }));
          } else if (getState().user.isAuthorized && req?.response.status === 502){
            dispatch(addError({ type: 0, message: 'api.error.code.502', from: '', translateType: true }));            
          } else if (getState().user.isAuthorized && req?.response.status === 500){
            dispatch(addError({ type: 0, message: 'api.error.code.500', from: '', translateType: true }));
            // dispatch(addError({ type: 0, message: req.response?.data?.message, from: '', translateType: false }));
          } else {
            const errors = req.response.data.errors;
            if (errors && Array.isArray(errors)) {
              errors.forEach((error, index) => {
                dispatch(addError({ type: 0, message: error.message, from: '', translateType: false }));
              })
            }
            
          }
          return req;
        }
      },
    }]
  }
}
export const store = createStore(
  rootReducer,
  composeEnhancer(
    applyMiddleware(
      axiosMiddleware(client, middlewareConfig),
      thunkMiddleware,
      logger,
      storageMiddleware
    )
  )
);
