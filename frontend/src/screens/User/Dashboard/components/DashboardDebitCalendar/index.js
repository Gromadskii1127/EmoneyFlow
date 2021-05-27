import React, { useState, Fragment, useEffect } from 'react';
import { injectIntl } from 'react-intl';
import addMonths from "date-fns/addMonths";
import { Hidden, Box, Grid, Paper, IconButton, Button } from '@material-ui/core';
import { withTheme } from '@material-ui/core/styles';
import ArrowLeft from '@material-ui/icons/ArrowLeft';
import ArrowRight from '@material-ui/icons/ArrowRight';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import * as UserDashboardActions from 'redux/actions/UserDashboardActions';
import { withMemo } from 'components/HOC';
import DashboardDebitCalendarMonth from './month';

const DashboardDebitCalendar = ({ dispatch, debits, theme, intl, ...props }) => {
  let [currentMonthDiff, setCurrentMonthDiff] = useState(0);
  const [firstMonthDate, setFirstMonthDate] = useState(addMonths(new Date(), -1));
  const [secondMonthDate, setSecondMonthDate] = useState(new Date());

  const increaseCurrentMonthDiff = (increaseBy) => {
    currentMonthDiff += increaseBy
    setCurrentMonthDiff(currentMonthDiff);
    setFirstMonthDate(addMonths(new Date(), currentMonthDiff - 1));
    setSecondMonthDate(addMonths(new Date(), currentMonthDiff));

  };

  useEffect(() => {
    dispatch(UserDashboardActions.getDashboardDebits(firstMonthDate, secondMonthDate));
  }, [firstMonthDate, secondMonthDate, dispatch])
  return (
    <Paper>
      <Box p={3}>
        <Grid container justify="center">
          <Fragment>
            <Hidden xsDown>
              <Grid item>
                <DashboardDebitCalendarMonth date={firstMonthDate} debits={debits.data}></DashboardDebitCalendarMonth>
              </Grid>
            </Hidden>
            <Grid item>
              <DashboardDebitCalendarMonth date={secondMonthDate} debits={debits.data}></DashboardDebitCalendarMonth>
            </Grid>
          </Fragment>

        </Grid>

        <Box mt={2}>
          <Grid container item justify="center" alignItems="center">
            <IconButton size="small" onClick={() => increaseCurrentMonthDiff(-1)}>
              <ArrowLeft fontSize="small" />
            </IconButton>
            <Button size="small" onClick={() => increaseCurrentMonthDiff(currentMonthDiff * -1)}>
              {intl.formatMessage({ id: 'today' })}
            </Button>
            <IconButton variant="raised" size="small" onClick={() => increaseCurrentMonthDiff(1)}>
              <ArrowRight fontSize="small" />
            </IconButton>
          </Grid>
        </Box>
      </Box>
    </Paper>
  )
};
const state = createStructuredSelector({
});
export default connect(state)(injectIntl(withTheme(withMemo(DashboardDebitCalendar))));