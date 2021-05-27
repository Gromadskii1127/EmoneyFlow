import { createSelector } from 'reselect';

export const AdminCompanySelector = state => state.company;

export const getCompanyList = createSelector([AdminCompanySelector], company => company.listData);

export const getCompany = createSelector([AdminCompanySelector], company => company.selected);

export const isLoading = createSelector([AdminCompanySelector], company => company.isLoading);

export const getResponse = createSelector([AdminCompanySelector], company => company.response);

export const isListLoading = createSelector([AdminCompanySelector], company => company.isListLoading);

export const isDeleting = createSelector([AdminCompanySelector], company => company.isDeleting);