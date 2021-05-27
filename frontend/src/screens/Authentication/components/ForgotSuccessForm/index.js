import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {Box } from '@material-ui/core';

// Components
import { Typography } from 'components';
import { withMemo } from 'components/HOC';
//Redux
import { getUser } from 'redux/selectors';
// images
import logo from 'assets/images/logo.svg';
import { FormattedMessage } from 'react-intl';
import { injectIntl } from 'react-intl';

const ForgotSuccessForm = ({ dispatch, intl, user, ...props }) => {
  return (
    <form className="d-flex flex-column flex-row align-items-center justify-content-center h-100">
      <img src={logo} alt="logo" />
      <Typography variant="h4" color="primary" className="mt-4">
        <FormattedMessage
          id="admin.user.dialog.reset.title"
        />
      </Typography>

      <Box className="width-372" mt={4}>
        <Typography variant="subtitle1" className="font-medium">
          <FormattedMessage
            id="forgot.password.content"
          />
        </Typography>

        <Typography variant="subtitle1" className="font-medium mt-2">
          <FormattedMessage
            id="forgot.password.suc.title"
          />
        </Typography>
      </Box>
    </form>
  );
};
const state = createStructuredSelector({
  user: getUser
});
export default connect(state)(injectIntl(withMemo(ForgotSuccessForm)));
