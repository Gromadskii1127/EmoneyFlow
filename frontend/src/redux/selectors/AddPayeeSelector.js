import { createSelector } from 'reselect';

export const AddPayeeSelector = state => state.addPayee;

export const getUserData = createSelector([AddPayeeSelector], state => state);