import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
// Components
import { Grid, Box } from '@material-ui/core';
import { injectIntl } from 'react-intl';
import { withMemo } from 'components/HOC';
import { EmoneyDatePicker } from 'components';
import { getUserSetting } from 'redux/selectors/UserSelector';

const TransactionDateFilter = ({ onChangeFilterDate, fromDate, toDate, userSetting }) => {
  // const formatInTimeZone = (date, fmt, tz) =>
  //   format(utcToZonedTime(date, tz),
  //     fmt,
  //     { timeZone: tz });
  //const [fromDate, setFromDate] = React.useState(new Date(formatInTimeZone(new Date(), DATE_FORMAT_TYPES[userSetting?.dateformat || 'mdy'], userSetting?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone)));
  //const [toDate, setToDate] = React.useState(new Date(formatInTimeZone(new Date(), DATE_FORMAT_TYPES[userSetting?.dateformat || 'mdy'], userSetting?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone)));

  /**
   * On fromDate Changed
   */
  const onFromDateChanged = React.useCallback(
    (value) => {
      let dateValue = value;
      if (toDate && value > toDate) {
        dateValue = toDate;
      }
      // Set From Date
      //setFromDate(dateValue);
      // Invoke parent's handler
      onChangeFilterDate(dateValue, toDate);
    },
    [onChangeFilterDate, toDate]
  );

  /**
   * On toDate Changed
   */
  const onToDateChanged = React.useCallback(
    (value) => {
      let dateValue = value;
      // Set From Date      
      if (fromDate && value < fromDate) {
        dateValue = fromDate;
      }
      //setToDate(dateValue);
      // Invoke parent's handler
      onChangeFilterDate(fromDate, dateValue);
    },
    [onChangeFilterDate, fromDate]
  );

  return (
    <Box
      display="flex"
      flexDirection="row"
      justifyContent="space-between"
      className="trans_filter_accordion_detail_date">
      <Grid container spacing={1}>
        <Grid item xs={12} md={6}>
          <EmoneyDatePicker
            value={fromDate}
            onChange={onFromDateChanged}
            adId="admin.transaction.search.filter.from"
            adDefaultMessage="FROM:"
            placeholderId="admin.transaction.search.filter.date.placeholder"
            placeholderDefault="dd.mm.yyy"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <EmoneyDatePicker
            value={toDate}
            onChange={onToDateChanged}
            adId="admin.transaction.search.filter.to"
            placeholderId="admin.transaction.search.filter.date.placeholder"
            placeholderDefault="dd.mm.yyy"
          />
        </Grid>
      </Grid>
    </Box>
  );
};

TransactionDateFilter.propTypes = {
  // Filter date changed handler - fromDate, toDate
  onChangeFilterDate: PropTypes.func.isRequired
};
const state = createStructuredSelector({
  userSetting: getUserSetting
});

export default connect(state)(injectIntl(withMemo(TransactionDateFilter)));