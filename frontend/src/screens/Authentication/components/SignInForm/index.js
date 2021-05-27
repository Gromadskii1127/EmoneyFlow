import React, { useState, useCallback } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { injectIntl, FormattedMessage } from 'react-intl';
import { useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
// Project Components
import { Button, Box } from '@material-ui/core';
import { AdormentTextField, Typography } from 'components';
// images
import logo from 'assets/images/logo.svg';
// Redux Action
import * as UserActions from 'redux/actions/UserActions';
import { getUser } from 'redux/selectors/UserSelector';
import { withMemo } from 'components/HOC';

const SignInForm = ({ dispatch, intl, user, }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState({});
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);

  const onSuccess = useCallback((data) => { }, []);

  const onFailure = useCallback((err) => {
    console.log('login failure error = ', err);
    if (err?.code === "InvalidParameterException") {
      setError(error => ({
        ...error,
        error: 'signin.error.invalid.parameter'
      }));
    } else if (err?.code === "UserNotConfirmedException") {
      setError(error => ({
        ...error,
        error: 'signin.error.not.confirm'
      }));
    } else if (err?.code === "NotAuthorizedException") {
      setError(error => ({
        ...error,
        error: 'signin.error.not.authorized'
      }));
    }
    setIsLoading(false);
  }, []);
  const newPasswordRequired = useCallback((data) => {
    setIsLoading(false);    
    history.push(`/user/newpwd?email=${data.email}&userAttr=${encodeURI(JSON.stringify(data))}`)
  }, [history]);
  const totpRequired = useCallback(() => {
    setIsLoading(false);
    history.push('/user/otp');
  }, [history]);
  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();

      setIsLoading(true);
      dispatch(
        UserActions.login(
          {
            username: username,
            password: password
          },
          onSuccess,
          onFailure,
          newPasswordRequired,
          totpRequired
        )
      );
    },
    [
      dispatch,
      username,
      password,
      onSuccess,
      onFailure,
      newPasswordRequired,
      totpRequired
    ]
  );
    
  return (
    <form className="d-flex flex-column flex-row align-items-center justify-content-center h-100">
      <img src={logo} alt="logo" />
      <Typography variant="h4" color="primary" className="mt-5">
        {
          user?.isLoggedout ? (
            <FormattedMessage
              id="signin.payment.title.logout"
              defaultMessage="You have been logged out!"
            />
          ) : (
              <FormattedMessage
                id="signin.payment.title"
                defaultMessage="Payouts made easy!"
              />
            )
        }

      </Typography>
      <Box className="width-372">
        <AdormentTextField
          fullWidth
          placeholder={intl.formatMessage({
            id: 'signin.require'
          })}
          adormentText={
            <p className="m-0">
              <FormattedMessage id="signin.user" defaultMessage="User:" />
            </p>
          }
          className="mt-6"
          disabled={isLoading}
          error={!!error['error']}
          value={username}
          onChange={(event) => {
            setUsername(event.target.value);
          }}
        />
        <AdormentTextField
          fullWidth
          placeholder={intl.formatMessage({
            id: 'signin.require'
          })}
          adormentText={
            <p className="m-0">
              <FormattedMessage
                id="signin.password"
                defaultMessage="Password:"
              />
            </p>
          }
          type="password"
          className="mt-3"
          value={password}
          disabled={isLoading}
          error={!!error['error']}
          helperText={
            error['error'] && intl.formatMessage({ id: error['error'] })
          }
          onChange={(event) => {
            setPassword(event.target.value);
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

            <p className="m-0 ml-2">
              <FormattedMessage id="signin.btn.login" defaultMessage="Login" />
            </p>
          </Box>
        </Button>
        <Box mt={2}>
          <Link to="/user/forgot">
            <Typography
              align="right"
              color="grey"
              variant="body1"
              underline={true}>
              <FormattedMessage id="forgot.password" />
            </Typography>
          </Link>
        </Box>
      </Box>
    </form>
  );
};
const state = createStructuredSelector({
  user: getUser
});
export default connect(state)(withMemo(injectIntl(SignInForm)));
