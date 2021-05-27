import { createSelector } from 'reselect';

export const ErrorSelector = (state) => state.errors;

export const getErrorList = createSelector(
  [ErrorSelector],
  (state) => state.list
);

