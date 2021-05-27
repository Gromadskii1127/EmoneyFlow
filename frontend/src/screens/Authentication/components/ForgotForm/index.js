import React, { useState, useCallback, useRef,  } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { Button, Box } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
// Components
import { AdormentTextField, Typography } from 'components';
import { Email } from 'components/AdormentTextField/validators';
import { withMemo } from 'components/HOC';
//Redux
import { getUser } from 'redux/selectors';
import * as UserActions from 'redux/actions/UserActions';
// images
import logo from 'assets/images/logo.svg';
import { FormattedMessage } from 'react-intl';
import { injectIntl } from 'react-intl';

const ForgotForm = ({ dispatch, intl, user, ...props }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');  
  const [submitted, setSubmitted] = useState(false);
  const validationErrors = useRef({});
  const history = useHistory();

 


  const onValidated = (field) => (validationError) => {    
    validationErrors.current[field] = validationError;    
  };
  
  const onSuccess = useCallback((data) => { 
    setIsLoading(false);
  }, []);
  
  const onFailure = useCallback((err) => {
    setIsLoading(false);
  }, []);
  const inputVerificationCode = useCallback((data) => {
    console.log('Input Verification ', data);
    setIsLoading(false);
    history.push('/user/forgotsuc');
  }, [history]);

  const handleChange = useCallback((event) => {
    setEmail(event.target.value);
  }, [])
  const handleForgotPwd = useCallback((e) => {
    setSubmitted(true);
    if (!validationErrors.current['email']){
      setIsLoading(true);
      dispatch(UserActions.forgotPassword(email, onSuccess, onFailure, inputVerificationCode));
    }
    e.preventDefault();
  }, [dispatch, validationErrors, email, inputVerificationCode, onSuccess, onFailure])

  return (
    <form className="d-flex flex-column flex-row align-items-center justify-content-center h-100" onSubmit={handleForgotPwd}>
      <img src={logo} alt="logo" />
      <Typography variant="h4" color="primary" className="mt-4">

        <FormattedMessage
          id="forgot.password.title"
          defaultMessage="Forgot your password?"
        />

      </Typography>
      <Box className="width-372" mt={3}>
        <Typography variant="subtitle1" className="font-medium">
          <FormattedMessage
            id="forgot.password.content"
          />
        </Typography>
        <AdormentTextField
          fullWidth
          placeholder={intl.formatMessage({ id: 'emoney.email.address' })}
          adormentText={
            <p className="m-0">
              <FormattedMessage id="emoney.email.address:" defaultMessage="Email Address:" />
            </p>
          }
          className="mt-4"
          disabled={isLoading}
          value={email}          
          submitted={submitted}
          validator={Email}
          onChange={handleChange}
          onValidated={onValidated('email')}
        />
        <Button
          type="submit"
          variant="contained"
          className="mt-4 width-372 bg-color-228fee text-white"
          disabled={isLoading}
         >
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
                    <span className="emicon-rest-password"></span>
                  </Box>
                )}
            </Box>
            <p className="m-0">
              <FormattedMessage id="admin.user.dialog.reset.title" defaultMessage="RESET PASSWORD" />
            </p>
          </Box>
        </Button>
      </Box>
    </form>
  );
};
const state = createStructuredSelector({
  user: getUser
});
export default connect(state)(injectIntl(withMemo(ForgotForm)));
