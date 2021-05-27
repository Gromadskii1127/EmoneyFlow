import { createSelector } from 'reselect';

export const PayoutUploadCsvSelector = state => state.payoutUploadCsv;

export const getUserData = createSelector([PayoutUploadCsvSelector], state => state);