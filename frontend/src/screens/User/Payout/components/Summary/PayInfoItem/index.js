import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { injectIntl } from 'react-intl';
import { Grid, Typography } from '@material-ui/core';

const Container = styled(Grid).attrs({
  container: true,
  justify: 'space-between'
})`
  width: 173px;
  border-bottom: 1px solid rgba(5, 36, 63, 0.5);
`;

const CurrencyValue = ({ value, currency }) => {
  return (
    <Container>
      <Grid item>
        <Typography variant="subtitle1">{currency}</Typography>
      </Grid>
      <Grid item>
        <Typography variant="subtitle1">{value}</Typography>
      </Grid>
    </Container>
  );
};

const PayInfoItem = ({ value, currency, intl }) => {
  const formatNumber = intl.formatNumber(value, {
    style: 'currency',
    currency: currency
  });

  return (
    <CurrencyValue
      currency={formatNumber.substr(0, 1)}
      value={formatNumber.substr(1)}
    />
  );
};

PayInfoItem.propTypes = {
  // Currency of payment value
  currency: PropTypes.string.isRequired,
  // Payment Value
  value: PropTypes.any.isRequired
};
export default injectIntl(PayInfoItem);
