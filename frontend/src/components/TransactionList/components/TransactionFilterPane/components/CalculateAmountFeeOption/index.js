import React from 'react';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
// Components
import { FormControlLabel, Box } from '@material-ui/core';
import { EmoneySwitch } from 'components';

const formLabelMessage = {
  id: 'admin.transaction.search.filter.calc',
  defaultMessage: 'Calculate amount and fees for this period'
};

const CalculateAmountFeeOption = ({ handleChange, intl }) => {
  return (
    <Box>
      <FormControlLabel
        control={<EmoneySwitch onChange={handleChange} />}
        label={intl.formatMessage(formLabelMessage)}
      />
    </Box>
  );
};

CalculateAmountFeeOption.propTypes = {
  // Handler when change switch option
  handleChange: PropTypes.func.isRequired
};

export default injectIntl(CalculateAmountFeeOption);
