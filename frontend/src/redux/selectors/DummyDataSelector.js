import { createSelector } from 'reselect';

export const DummyDataSelector = state => state.dummy;

export const getDummyData = createSelector(
  [DummyDataSelector],
  dummy => dummy.data
);
