import { createSelector } from 'reselect';

export const UserTransactionSelector = state => state.userTransaction;

export const getTransactionList = createSelector([UserTransactionSelector], transaction => transaction.listData);

export const getTransaction = createSelector([UserTransactionSelector], transaction => transaction.selected);
