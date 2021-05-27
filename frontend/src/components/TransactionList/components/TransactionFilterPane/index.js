import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { injectIntl } from 'react-intl';
// Components
import { Collapse, Grid, Box } from '@material-ui/core';
import {
  TransactionDateFilter,
  CalculateAmountFeeOption,
  PaymentMethodFilter,
  CurrencyFilter,
  StatusFilter
} from './components';
// Project Components
import { withMemo } from 'components/HOC';

const TransactionFilterPane = ({ checked, onChangedFilter,  onCalcAmountOptionChange }) => {
  /**
   * Handler when calculate amount or fee option changed
   */
  const [filter, setFilter] = useState({fromDate: null, toDate: null})


  /**
   * handler when filter date changed
   */
  const onChangeFilterDate = React.useCallback((fromDate, toDate) => {
    // TODO: update filter params w/ fromDate and toDate
    setFilter(filter => (
      {
        ...filter,
        fromDate: fromDate,
        toDate: toDate
      }
    ));
  }, []);

  /**
   * handler when payment method changed
   */
  const onPaymentMethodFilterChanged = React.useCallback((option) => {
    // TODO: update filter params w/ paymentMethod option object value
    setFilter(filter => (
      {
        ...filter,
        method: option
      }
    ));
  }, []);

  const onCurrencyFilterChanged = React.useCallback((option) => {
    // TODO: update filter params w/ currency option object value
    setFilter(filter => (
      {
        ...filter,
        currency: option
      }
    ));

  }, []);

  const onStatusFilterChanged = React.useCallback((option) => {
    // TODO: update filter params w/ status option object value

    setFilter(filter => (
      {
        ...filter,
        status: option
      }
    ));
  }, []);

  useEffect(() => {
    if (onChangedFilter)
      onChangedFilter(filter);
  }, [filter, onChangedFilter])
  return (
    <Collapse in={checked}>
      <Box display="flex" flexDirection="column" width="100%" my={4}>
        <Grid container direction="column" spacing={2}>
          <Grid item>
            <TransactionDateFilter onChangeFilterDate={onChangeFilterDate} fromDate={filter.fromDate} toDate={filter.toDate} />
          </Grid>
          {(filter.fromDate || filter.toDate) && (<Grid item>
            <CalculateAmountFeeOption handleChange={onCalcAmountOptionChange} />
          </Grid>)}
          <Grid item>
            <Box mt={2}>
              <PaymentMethodFilter onChange={onPaymentMethodFilterChanged} />
            </Box>
          </Grid>
          <Grid item>
            <CurrencyFilter onChange={onCurrencyFilterChanged} />
          </Grid>
          <Grid item>
            <StatusFilter onChange={onStatusFilterChanged} />
          </Grid>
        </Grid>
      </Box>
    </Collapse>
  );
};

TransactionFilterPane.propTypes = {
  // identifies whether filter pane show or not.
  checked: PropTypes.bool.isRequired
};
const state = createStructuredSelector({

});

export default connect(state)(injectIntl(withMemo(TransactionFilterPane)));
