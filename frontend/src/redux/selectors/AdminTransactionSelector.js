import { createSelector } from 'reselect';

export const AdminTransactionSelector = state => state.transaction;

export const getTransactionList = createSelector([AdminTransactionSelector], transaction => transaction.listData);

export const getTransaction = createSelector([AdminTransactionSelector], transaction => transaction.selected);
