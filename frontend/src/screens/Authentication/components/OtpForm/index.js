import React, { useState, useCallback } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { Button, Box } from '@material-ui/core';

// Components
import { AdormentTextField, Typography } from 'components';
import { withMemo } from 'components/HOC';
//Redux
import { getUser } from 'redux/selectors';
// images
import logo from 'assets/images/logo.svg';
import { FormattedMessage } from 'react-intl';
import { injectIntl } from 'react-intl';
import * as UserActions from 'redux/actions/UserActions';

const OtpForm = ({ dispatch, intl, user, ...props }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [otp, setOtp] = useState('');
  const [error, setError] = useState({});
  const onSuccess = useCallback(() => {}, []);
  const onFailure = useCallback((err) => {
    setError(err);
    setIsLoading(false);
  }, []);
  const handleSubmit = useCallback(
    (event) => {
      setIsLoading(true);
      event.preventDefault();
      dispatch(
        UserActions.checkOtpCode(
          { code: otp, username: user.userName },
          onSuccess,
          onFailure
        )
      );
    },
    [dispatch, otp, user, onSuccess, onFailure]
  );

  return (
    <form className="d-flex flex-column flex-row align-items-center justify-content-center h-100">
      <img src={logo} alt="logo" />
      <Typography variant="h4" color="primary" className="mt-4">
        <FormattedMessage
          id="signin.payment.title"
          defaultMessage="Payouts made easy!"
        />
      </Typography>
      <Box className="width-372" mt={4}>
        <AdormentTextField
          fullWidth
          placeholder={intl.formatMessage({ id: 'otp.enter.code' })}
          adormentText={
            <p className="m-0">
              <FormattedMessage id="otp.code" defaultMessage="Otp:" />
            </p>
          }
          className="mt-6"
          disabled={isLoading}
          value={otp}
          error={!!error['code']}
          onChange={(event) => {
            setOtp(event.target.value);
          }}
        />
        <Button
          type="submit"
          variant="contained"
          className="mt-4 width-372 bg-color-228fee text-white"
          disabled={isLoading}
          onClick={handleSubmit}>
          <Box width="100%" position="relative">
            <Box position="absolute" left="0" top="0">
              {isLoading ? (
                <FontAwesomeIcon
                  icon={faSpinner}
                  className="fa-spin"
                  size="lg"
                />
              ) : (
                <Box fontSize={14}>
                  <span className="emicon-lock"></span>
                </Box>
              )}
            </Box>
            <p className="m-0">
              <FormattedMessage id="signin.btn.login" defaultMessage="Login" />
            </p>
          </Box>
        </Button>
        <Box mt={2}>
          <Typography
            align="right"
            color="grey"
            variant="body1"
            underline={true}>
            <FormattedMessage id="otp.need.help" />
          </Typography>
        </Box>
      </Box>
    </form>
  );
};
const state = createStructuredSelector({
  user: getUser
});
export default connect(state)(injectIntl(withMemo(OtpForm)));
