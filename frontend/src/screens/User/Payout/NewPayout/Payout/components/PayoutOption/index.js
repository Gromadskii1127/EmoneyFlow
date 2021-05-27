import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Grid, Radio, RadioGroup, FormControlLabel } from '@material-ui/core';

import { withMemo } from 'components/HOC';
import { getUserData } from 'redux/selectors/AddPayoutSelector';

import { AdormentTextField, EmoneyDatePicker, LoadingButton } from 'components';

const PayoutOption = ({ isLoading, intl, dispatch, showNext, nextRoute, userData, handleClickNext, handleChangeOptionValue, values, ...props }) => {
  
  return (
    <Grid item container>
      <Grid item xs={12} md={7}>
      </Grid>
      <Grid item container spacing={2} xs={12} md={5} direction="column">
        <Grid item>
          <AdormentTextField
            fullWidth
            placeholder={intl.formatMessage({ id: "required.field", defaultMessage: "Rquired Field" })}
            adormentText={intl.formatMessage({ id: "user.payout.global.reference", defaultMessage: "Global Reference" })}
            value={values['reference'] || ''}
            name="reference"
            onChange={event => { if (handleChangeOptionValue) handleChangeOptionValue("reference", event.target.value)}}
            className="mt-2 mb-2 company-normal-textfield"
          />
        </Grid>
        <Grid item container>
          <div className="d-flex flex-row">
            <FormControlLabel
              control={<div />}
              label={intl.formatMessage({ id: "user.payout.global.date", defaultMessage: "Date:" })}
              classes={{ label: "font-medium font-bold font-cursor-default", root: "ml-0 mr-4" }}
              labelPlacement="start"
            />
            <RadioGroup row name="dateType" value={values["dateType"] || 'today'} onChange={event => { if (handleChangeOptionValue) handleChangeOptionValue("dateType", event.target.value)}}>
              <FormControlLabel
                value="today"
                control={<Radio color="primary" />}
                label={intl.formatMessage({ id: "emoney.today", defaultMessage: "Today" })}
                classes={{ label: "font-medium font-bold" }}
                labelPlacement="end"
              />
              <FormControlLabel
                value="on"
                control={<Radio color="primary" />}
                label={intl.formatMessage({ id: "emoney.on", defaultMessage: "On" })}
                classes={{ label: "font-medium font-bold" }}
                labelPlacement="end"
              />
            </RadioGroup>
          </div>
        </Grid>
        {
          values['dateType'] === "on" && (
            <Grid item xs={12} md={12}>
              <EmoneyDatePicker
                name="dateValue"
                value={values['dateValue'] || new Date()}
                onChange={event => { if (handleChangeOptionValue) handleChangeOptionValue("dateValue", event)}}
                adId="user.payout.execution.date"
                adDefaultMessage="Execution Date:"
                placeholderId="admin.transaction.search.filter.date.placeholder"
                placeholderDefault="dd.mm.yyy"
              />
            </Grid>
          )
        }
        <Grid item className="user-payout-bottom-border mt-5">

        </Grid>
        <Grid item container direction="row-reverse" spacing={0}>
          <LoadingButton variant="contained" color="primary" onClick={handleClickNext}>{intl.formatMessage({ id: "emoney.continue" })}</LoadingButton>
        </Grid>
      </Grid>
    </Grid>
  )
}

const state = createStructuredSelector({
  userData: getUserData,
});
export default connect(state)(injectIntl(withMemo(PayoutOption)));
