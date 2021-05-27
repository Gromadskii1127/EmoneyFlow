import React, { Fragment, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { injectIntl } from 'react-intl';
import Grid from '@material-ui/core/Grid';
import { withTheme } from '@material-ui/core/styles';

// Project Components
import { withMemo } from 'components/HOC';
import * as UserDashboardActions from 'redux/actions/UserDashboardActions';
import {
  getDashboardKpis,
  getDashboardDebits,
  getDashboardBalance,
  getDashboardTopPayees,
  getDashboardFees
} from 'redux/selectors/UserDashboardSelector';
import DashboardSection from './components/DashboardSection';
import DashboardTile from './components/DashboardTile';
import DashboardDebitCalendar from './components/DashboardDebitCalendar';
import DashboardBalance from './components/DashboardBalance';
import DashboardTable from './components/DashboardTable';
import {
  TableHeaderFilters,
  TableHeaderCounts
} from './components/DashboardTable/constants';
import { TopPayeesColumns, FeesColumns } from './columns';

const Dashboard = ({
  dispatch,
  component: Component,
  intl,
  theme,
  ...props
}) => {
  const [topPayeesFilter, setTopPayeesFilter] = useState({
    count: TableHeaderCounts[4],
    filter: TableHeaderFilters[1]
  });
  const [topPayeesLoadingPromise, setTopPayeesLoadingPromise] = useState();

  const [feesFilter, setFeesFilter] = useState({
    filter: TableHeaderFilters[1]
  });
  const [feesLoadingPromise, setFeesLoadingPromise] = useState();

  const [isFirstTime, setIsFirstTime] = useState(false);

  const onFilterTopPayees = (filter) => {
    setTopPayeesFilter(filter);
    dispatch(
      UserDashboardActions.getDashboardTopPayees(filter.count, filter.filter)
    );
  };

  const onFilterFees = (filter) => {
    setFeesFilter(filter);
    dispatch(
      UserDashboardActions.getDashboardFees(filter.count, filter.filter)
    );
  };

  useEffect(() => {
    if (isFirstTime) return;
    dispatch(UserDashboardActions.getDashboardKpis())
    dispatch(UserDashboardActions.getDashboardBalance())
    setTopPayeesLoadingPromise(
      dispatch(
        UserDashboardActions.getDashboardTopPayees(
          topPayeesFilter.count,
          topPayeesFilter.filter
        )
      )
    );
    setFeesLoadingPromise(
      dispatch(
        UserDashboardActions.getDashboardFees(
          feesFilter.count,
          feesFilter.filter
        )
      )
    );
    setIsFirstTime(true);
  }, [dispatch, topPayeesFilter, feesFilter, intl, isFirstTime]);

  const {
    kpis: {
      isLoading,
      data: {
        lastTransactionSuccess,
        lastTransactionPending,
        lastTransactionError,
        lastSevenDaysSuccess,
        lastSevenDaysPending,
        lastSevenDaysError
      }
    },
    debits,
    balance,
    fees,
    topPayees
  } = props;

  
  return (
    <Fragment>
      <DashboardSection>
        <Grid container spacing={3}>
          <Grid item md={4} sm={6} xs={12}>
            <DashboardTile
              title="dashboard.last-transaction"
              type="success"
              isLoading={isLoading}
              userData={lastTransactionSuccess}></DashboardTile>
          </Grid>
          <Grid item md={4} sm={6} xs={12}>
            <DashboardTile
              title="dashboard.last-transaction"
              type="warning"
              isLoading={isLoading}
              userData={lastTransactionPending}></DashboardTile>
          </Grid>
          <Grid item md={4} sm={6} xs={12}>
            <DashboardTile
              title="dashboard.last-transaction"
              type="error"
              isLoading={isLoading}
              userData={lastTransactionError}></DashboardTile>
          </Grid>
          <Grid item md={4} sm={6} xs={12}>
            <DashboardTile
              title="dashboard.last-seven-days"
              type="success"
              isLoading={isLoading}
              userData={lastSevenDaysSuccess}></DashboardTile>
          </Grid>
          <Grid item md={4} sm={6} xs={12}>
            <DashboardTile
              title="dashboard.last-seven-days"
              type="warning"
              isLoading={isLoading}
              userData={lastSevenDaysPending}></DashboardTile>
          </Grid>
          <Grid item md={4} sm={6} xs={12}>
            <DashboardTile
              title="dashboard.last-seven-days"
              type="error"
              isLoading={isLoading}
              userData={lastSevenDaysError}></DashboardTile>
          </Grid>
        </Grid>
      </DashboardSection>

      <DashboardSection>
        <Grid container spacing={3}>
          <Grid item md={8} xs>
            <DashboardDebitCalendar debits={debits}></DashboardDebitCalendar>
          </Grid>
          <Grid container item alignItems="stretch" md={4} xs>
            <DashboardBalance
              isLoading={balance.isLoading}
              balanceData={balance.list}></DashboardBalance>
          </Grid>
        </Grid>
      </DashboardSection>

      <DashboardSection>
        <DashboardTable
          title="dashboard.top-payees"
          items={topPayees?.data}
          columns={TopPayeesColumns(intl, theme)}
          filterState={topPayeesFilter}
          onFilter={onFilterTopPayees}
          withCountSelection={true}
          sizePerPage={topPayeesFilter.count}
          loadingPromise={topPayeesLoadingPromise}></DashboardTable>
      </DashboardSection>

      <DashboardSection>
        <DashboardTable
          title="dashboard.fees"
          items={fees?.data}
          columns={FeesColumns(intl, theme)}
          filterState={feesFilter}
          onFilter={onFilterFees}
          loadingPromise={feesLoadingPromise}></DashboardTable>
      </DashboardSection>
    </Fragment>
  );
};

const state = createStructuredSelector({
  kpis: getDashboardKpis,
  debits: getDashboardDebits,
  balance: getDashboardBalance,
  topPayees: getDashboardTopPayees,
  fees: getDashboardFees
});
export default connect(state)(injectIntl(withTheme(withMemo(Dashboard))));
