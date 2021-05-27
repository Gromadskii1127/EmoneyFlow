import { createSelector } from 'reselect';

export const UserDashboardSelector = state => state.dashboard;

export const getDashboardKpis = createSelector([UserDashboardSelector], dashboard => dashboard.kpis);

export const getDashboardDebits = createSelector([UserDashboardSelector], dashboard => dashboard.debits);

export const getDashboardBalance = createSelector([UserDashboardSelector], dashboard => dashboard.balance);

export const getDashboardTopPayees = createSelector([UserDashboardSelector], dashboard => dashboard.topPayees);

export const getDashboardFees = createSelector([UserDashboardSelector], dashboard => dashboard.fees);