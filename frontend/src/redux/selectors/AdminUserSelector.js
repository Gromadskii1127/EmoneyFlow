import { createSelector } from 'reselect';

export const AdminUserSelector = state => state.adminUser;

export const getUserList = createSelector([AdminUserSelector], adminUser => adminUser.listData);

export const getUser = createSelector([AdminUserSelector], adminUser => adminUser.selected);