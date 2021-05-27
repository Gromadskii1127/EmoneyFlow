import { createSelector } from 'reselect';

export const PayoutSelector = state => state.payout;

export const getLocalPayouts = createSelector([PayoutSelector], state => state.local);