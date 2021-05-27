import { createSelector } from 'reselect';

export const AddPayoutSelector = state => state.addPayout;

export const getUserData = createSelector([AddPayoutSelector], state => state);