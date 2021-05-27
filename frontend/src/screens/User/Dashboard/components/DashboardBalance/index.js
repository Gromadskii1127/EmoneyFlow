import React from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography
} from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { withMemo } from 'components/HOC';
import { withTheme } from '@material-ui/core/styles';
import { injectIntl } from 'react-intl';
import { UppercasedTypography } from '../../../components/helper';

const DashboardBalance = ({ intl, isLoading, balanceData, ...props }) => {
  const AmountComponent = (amount, currency) => {
    return (isLoading
      ? <Skeleton variant="text" />
      : <Typography style={{ flex: 1 }} variant="h3">
        {intl.formatNumber(amount, { style: 'currency', currency: currency || 'EUR' })}
      </Typography>);
  }

  const IbanComponent = (iban) => {
    return (isLoading
      ? <Skeleton variant="text" />
      :
      <Grid container direction="column" alignItems="center">
        <Typography style={{ flex: 1 }} variant="caption">
          {intl.formatMessage({ id: 'dashboard.sepa-express' })}:
      </Typography>
        <Typography style={{ flex: 1 }} variant="caption">
          {iban}
        </Typography>
      </Grid>);
  }
  console.log(balanceData);
  return (
    <Paper style={{ width: '100%' }}>
      <Box p={3} style={{ height: '100%' }}>
        <Grid container direction="column" justify="space-between" style={{ height: '100%' }}>
          <Grid container item justify="center">
            <UppercasedTypography>
              {intl.formatMessage({ id: 'dashboard.balance' })}
            </UppercasedTypography>
          </Grid>
          <Grid container item justify="center" alignItems="center" xs>
            {
              balanceData?.map((balance, index) =>
              (
                <div>
                  <Box mb={3}>{AmountComponent(balance.amount, balance.currency)}</Box>
                  {IbanComponent(balance.iban)}
                </div>
              ))
            }

          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default withTheme(injectIntl(withMemo(DashboardBalance)));