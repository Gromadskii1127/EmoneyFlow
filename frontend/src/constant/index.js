import * as urls from './urls';
import * as columns from './columns';
import * as enums from './enum';
import * as test from './test';
import { find } from 'lodash';

export const TEST = process.env.NODE_ENV === 'development' ? true : false;
// Redux
export const SUCCESS_SUFFIX = '_SUCCESS';
export const ERROR_SUFFIX = '_FAIL';

// API URLS
export const API_URLS = urls;

// Table Column Datas

export const COLUMNS = columns;

export const ENUMS = enums;

export const TESTDATA = test;

export const methodValues = [
  { name: 'method.SEPA', default: 'SEPA', value: 'sepa', rvalue: 0 },
  /*{
    name: 'method.OCTARUSSIA',
    default: 'OCTA RUSSIA',
    value: 'octaRussia',
    rvalue: 1
  },
  { name: 'method.CCUSA', default: 'CC USA', value: 'ccUsa', rvalue: 2 },
  {
    name: 'method.CCEUROPA',
    default: 'CC EUROPA',
    value: 'ccEuropa',
    rvalue: 2
  },
  {
    name: 'method.CCPAGAFLEX',
    default: 'CC PAGAFLEX',
    value: 'ccPagaflex',
    rvalue: 3
  },
  {
    name: 'method.COMXBANK',
    default: 'CO/MX BANK TRANSFERS',
    value: 'coMxbankTransfer',
    rvalue: 4
  }*/
];
export const convertMethodRValue = (rValue) =>
  find(methodValues, (v) => v.rvalue === rValue)?.value;

export const convertMethodValue = (value) =>
  find(methodValues, (v) => v.value === value)?.value;


export const currencyValues = [
  { name: 'currency.eur', default: 'EUR', value: 'EUR', symbol: '€' },
  { name: 'currency.usd', default: 'USD', value: 'USD', symbol: '$' },
  { name: 'currency.pound', default: 'POUND', value: 'GBP', symbol: '£' }
];

export const statusValues = [
  {
    name: 'status.notsigned',
    default: 'ERROR',
    value: 'error',
    icon: true,
    color: '#CBCBCB'
  },
  {
    name: 'status.success',
    default: 'SUCCESS',
    value: 'success',
    icon: true,
    color: '#5FDD35'
  },
  {
    name: 'status.error',
    default: 'ERROR',
    value: 'error',
    icon: true,
    color: '#EF394F'
  },
  {
    name: 'status.pending',
    default: 'PENDING',
    value: 'pending',
    icon: true,
    color: '#FDC93D'
  },
  {
    name: 'status.declined',
    default: 'DECLINED',
    value: 'declined',
    icon: true,
    color: '#8334D6'
  }
];
export const stateValues = {
  "created": {
    name: 'status.created',
    default: 'CREATED',
    value: 'created',
    icon: true,
    color: '#00673D'
  },

  "scheduled": {
    name: 'status.scheduled',
    default: 'SCHEDULED',
    value: 'scheduled',
    icon: true,
    color: '#FDFF3D'
  },
  "failed": {
    name: 'status.error',
    default: 'ERROR',
    value: 'error',
    icon: true,
    color: '#EF394F'
  },
  "paid": {
    name: 'status.success',
    default: 'SUCCESS',
    value: 'success',
    icon: true,
    color: '#5FDD35'
  },
  "pendingReview": {
    name: 'status.pending',
    default: 'PENDING',
    value: 'pending',
    icon: true,
    color: '#FDC93D'
  },

  "pendingSubmission": {
    name: 'status.pending',
    default: 'PENDING',
    value: 'pending',
    icon: true,
    color: '#FDC93D'
  },

  "discarded": {
    name: 'status.declined',
    default: 'DECLINED',
    value: 'declined',
    icon: true,
    color: '#8334D6'
  },
  "submitted": {

  },
  "expired": {

  },
  "chargedBack": {

  },

};

export const DATE_FORMAT_TYPES = {
  "mdy": "MM/dd/yyyy",
  "dmy": "dd/MM/yyyy",
  "ymd": "yyyy/MM/dd"
}
export const TIME_FORMAT_TYPES = {
  "24": "24",
  "12": "12"
}
export const NUMBER_FORMAT_TYPES = {
  "1": "1",
  "2": "2"
}
export const AVAILABLE_TEXT_COLORS = ['primary', 'black', 'grey'];

export const AVAILABLE_COLORS = ['cyan', 'primary'];

export const DEFAULT_PAGNATION_COUNT = 10;
