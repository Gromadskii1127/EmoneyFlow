import { createSelector } from 'reselect';

export const UserSelector = state => state.user;

export const getUser = createSelector([UserSelector], user => user);

export const getUserSetting = createSelector([UserSelector], user => user.info);

