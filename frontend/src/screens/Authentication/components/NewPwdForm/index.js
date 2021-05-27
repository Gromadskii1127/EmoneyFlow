import React, { useState, useCallback } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { Button, Box } from '@material-ui/core';
import { useHistory, useLocation } from 'react-router-dom';
// Components
import { AdormentTextField, Typography } from 'components';
import { withMemo } from 'components/HOC';
//Redux
import { getUser } from 'redux/selectors';
import * as UserActions from 'redux/actions/UserActions';
// images
import logo from 'assets/images/logo.svg';
import { FormattedMessage } from 'react-intl';
import { injectIntl } from 'react-intl';

const NewPwdForm = ({ dispatch, intl, user, ...props }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [pwd, setPwd] = useState('');
  const [repwd, setRePwd] = useState('');
  const [error, setError] = useState({});
  const history = useHistory();
  const onSuccess = useCallback((data) => {
    setIsLoading(false);
    history.push('/user/signin');
  }, [history]);
  const useQuery = () => {
    return new URLSearchParams(useLocation().search);
  };
  const query = useQuery();
  const onFailure = useCallback((err) => {
    setIsLoading(false);
    setError(err => ({
      ...err,
      'pwd': err,
    }));
  }, []);
  const handleSubmit = useCallback(
    (event) => {
      setSubmitted(true);
      if (pwd !== repwd) {
        setError(err => ({
          ...err,
          'repwd': 'newpwd.set.validator.pwd',
        }));
      } else {
        setIsLoading(true);

        const code = query.get("code")
        const email = query.get("email");
        const userAttrStr = query.get("userAttr");
        const userAttr = JSON.parse(decodeURI(userAttrStr));
        if (code) {
          dispatch(UserActions.resetPassword(email, code, pwd, onSuccess, onFailure));
        } else {
          dispatch(UserActions.setNewPassword(email, pwd, userAttr, onSuccess, onFailure));
        }
        
      }
      event.preventDefault();
    },
    [dispatch, pwd, repwd, onSuccess, onFailure, query]
  );


  return (
    <form className="d-flex flex-column flex-row align-items-center justify-content-center h-100" onSubmit={handleSubmit}>
      <img src={logo} alt="logo" />
      <Typography variant="h4" color="primary" className="mt-4">
        <FormattedMessage
          id="newpwd.title"
          defaultMessage="Set New Password"
        />
      </Typography>
      <Box className="width-372" mt={2}>
        <AdormentTextField
          fullWidth
          placeholder={intl.formatMessage({ id: 'required.field' })}
          adormentText={
            <p className="m-0">
              <FormattedMessage id="newpwd.newpwd:" />
            </p>
          }
          className="mt-5"
          type="password"
          disabled={isLoading}
          value={pwd}
          required={true}
          error={!!error['pwd']}
          submitted={submitted}
          onChange={(event) => {
            setPwd(event.target.value);
          }}
        />
        <AdormentTextField
          fullWidth
          placeholder={intl.formatMessage({ id: 'required.field' })}
          adormentText={
            <p className="m-0">
              <FormattedMessage id="newpwd.retype.pwd:" />
            </p>
          }
          className="mt-3"
          type="password"
          disabled={isLoading}
          required={true}
          value={repwd}
          error={!!error['repwd']}
          submitted={submitted}
          onChange={(event) => {
            setRePwd(event.target.value);
          }}
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
                  ''
                )}
            </Box>
            <p className="m-0">
              <FormattedMessage id="newpwd.set.pwd" />
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
export default connect(state)(injectIntl(withMemo(NewPwdForm)));
