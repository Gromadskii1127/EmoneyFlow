import { createSelector } from 'reselect';

export const PayeeUploadCsvSelector = state => state.payeeUploadCsv;

export const getUserData = createSelector([PayeeUploadCsvSelector], state => state);