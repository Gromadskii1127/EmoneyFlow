import { createSelector } from 'reselect';

export const PayeeSelector = (state) => state.payee;

export const getPayeeList = createSelector(
  [PayeeSelector],
  (state) => state.listData
);

export const getPayeeDetails = createSelector(
  [PayeeSelector],
  (state) => state.details
);

export const getPayeeData = createSelector(
  [PayeeSelector],
  (state) => state.payeeData
);
