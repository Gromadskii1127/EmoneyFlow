import React, { Fragment, useState, useCallback, useEffect, useRef } from 'react';
import { injectIntl } from 'react-intl';
import {
  Grid,
  RadioGroup,
  FormControlLabel,
  Box,
  Radio,
} from '@material-ui/core';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Skeleton } from '@material-ui/lab';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { listTimeZones } from 'timezone-support'
import { withTheme, makeStyles } from '@material-ui/core/styles';
import _, { keys, every } from 'lodash';
// Redux
import { createStructuredSelector } from 'reselect';
import { getUser } from 'redux/selectors/UserSelector';
import {
  getUserInfo,
  updateUserInfo,
  disableMFA,
  setMFAEnabled
} from 'redux/actions/UserActions';
import { Email } from 'components/AdormentTextField/validators';
//Emoney Component
import { withMemo } from 'components/HOC';
import {
  AdormentTextField,
  EmoneySelect,
  LoadingButton,
  EmoneyDrawer,
  EmoneySwitch
} from 'components';
import { MFACard } from './components'

const useStyles = makeStyles({
  MFAContainer: ({ theme }) => ({
    width: 429,
    boxShadow: 'rgb(0 0 0 / 16%) 0px 2px 4px -1px, rgb(0 0 0 / 16%) 0px 4px 5px 0px, rgb(0 0 0 / 16%) 0px 1px 10px 0px',
    borderRadius: theme.card.borderRadius,
    marginLeft: -35,
  }),
  otpNotification: ({ theme }) => ({
    backgroundColor: theme.palette.background.green,
    width: 300,
    height: 50,
    fontSize: '14px',

  }),
  otpSuccssContent: ({ theme }) => ({
    color: 'white',
    fontSize: '14px'
  }),
})

const UserSetting = ({
  dispatch,
  intl,
  open,
  handleCloseSetting,
  userData,
  theme
}) => {
  //state
  const classes = useStyles({ theme })
  const [userSetting, setUserSetting] = useState({});
  const [isDisabling, setIsDisabling] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(open);
  const [savePromise, setSavePromise] = useState();
  const [mfaStatus, setMfaStatus] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [userInfoSubmitted, setUserInfoSubmitted] = useState(true);
  const [isJustEnabled, setIsJustEnabled] = useState(false);
  const validationErrors = useRef({});
  // handle
  useEffect(() => {
    console.log('mfa Status = ', mfaStatus);
  }, [mfaStatus])
  const toggleDrawer = useCallback(
    (toggleOpen) => (event) => {
      if (
        event.type === 'keydown' &&
        (event.key === 'Tab' || event.key === 'Shift')
      ) {
        return;
      }
      setDrawerOpen(toggleOpen);
      if (handleCloseSetting) handleCloseSetting(false);
    },
    [handleCloseSetting, setDrawerOpen]
  );
  const onValidateOtpCode = (field) => (validationError) => {
    validationErrors.current[field] = validationError;
  }
  const handleClose = useCallback(() => {

    if (!userData?.isLoading && !userData?.isUpdating) {
      toggleDrawer(false);
      setDrawerOpen(false);
      if (handleCloseSetting) handleCloseSetting(false);
    }
  }, [
    toggleDrawer,
    handleCloseSetting,
    userData?.isLoading,
    userData?.isUpdating
  ]);
  const handleMFAStatus = useCallback((event) => {
    if (!event.target.checked && userSetting?.mfaEnabled) {
      setSubmitted(true)
      if (!validationErrors.current['otpcode'] && otpCode !== "") {
        setIsDisabling(true);
        dispatch(disableMFA(otpCode)).then((response) => {
          if (response?.payload?.status === 200) {
            dispatch(setMFAEnabled(false));
            setUserSetting(_.extend({}, userSetting, {
              mfaEnabled: false
            }));

            setMfaStatus(event.target.checked);
          } else {
            // dispatch(addError({ type: 0, message: 'user.setting.mfa.error', from: 'UserSetting', translateType: true }));
          }
          setIsDisabling(false);
        })
      }
    } else {
      setMfaStatus(event.target.checked)
    }

  }, [dispatch, otpCode, userSetting]);

  const handleEnabledMFA = useCallback(() => {
    setIsJustEnabled(true);
    setTimeout(() => {
      setIsJustEnabled(false);
    }, 1000);

    setUserSetting(_.extend({}, userSetting, {
      mfaEnabled: true
    }))
  }, [userSetting]);
  const handleCloseMFACard = useCallback((event) => {
    setMfaStatus(false);
  }, [])
  const handleChangeTimeZone = useCallback(
    ({ target: { value } }) => {
      setUserSetting(
        _.extend({}, userSetting, {
          timezone: value
        })
      );
    },
    [userSetting]
  );

  const handleChange = useCallback(
    (event) => {
      setUserSetting(
        _.extend({}, userSetting, {
          [event.target.name]: event.target.value
        })
      );
    },
    [userSetting]
  );


  const handleClickSave = useCallback(
    (event) => {
      if (userSetting?.password && userSetting.password !== '') {
        if (userSetting?.opassword === '') {
          return alert(
            intl.formatMessage({ id: 'user.setting.currentpassword.required' })
          );
        }
        if (userSetting.password !== userSetting.cpassword) {
          return alert(
            intl.formatMessage({ id: 'user.setting.confirmpassword.required' })
          );
        }
      }
      setUserInfoSubmitted(true);
      if (isValueValid.current){
        userSetting['timezone'] = userSetting['timezone'] ? userSetting['timezone'] : '';
        userSetting['status'] = userSetting['status'] ? userSetting['status'] : 1;
        userSetting['companyId'] = userSetting['companyId'] ? userSetting['companyId'] : 0;
        userSetting['id'] = userSetting['id'] ? userSetting['companyId'].toString() : 0;
        setSavePromise(
          dispatch(updateUserInfo(userSetting)).then((response) => {
            if (response?.payload?.status === 200) {
              handleClose();
            } else {
             
            }
          })
        );
      }

    },
    [dispatch, userSetting, intl, handleClose]
  );
  const resetDatas = useCallback(() => {
    setUserInfoSubmitted(false);
    setUserSetting({});
    setSavePromise();
    setOtpCode('');
    setSubmitted(false);
    setIsDisabling(false);
    setIsJustEnabled(false);
  }, []);
  useEffect(() => {
    setDrawerOpen(open);
    resetDatas();
    if (open) {
      dispatch(getUserInfo());
    }
  }, [open, dispatch, resetDatas, intl]);

  useEffect(() => {
    const info = userData?.info;
    info['mfaEnabled'] = userData?.mfaEnabled;
    console.log('userData mFA = ', info['mfaEnabled']);
    setMfaStatus(userData?.mfaEnabled);
    setUserSetting(info);
  }, [userData?.info, userData?.mfaEnabled]);

  useEffect(() => {
    console.log('user Data is loading ', userData?.isLoading, userData?.isUpdating)
  }, [userData]);
  const [header, setHeader] = useState();
  useEffect(() => {
    setHeader(
      <LoadingButton
        disabled={userData?.isLoading || userData?.isUpdating}
        loadingPromise={savePromise}
        aria-label="close"
        size="medium"
        onClick={handleClickSave}
        className="company-drawer-save-button">
        <FormattedMessage
          id="admin.user.drawer.save"
          defaultMessage="SAVE & LEAVE"
        />
      </LoadingButton>
    );
  }, [
    userData?.isLoading,
    userData?.isUpdating,
    savePromise,
    handleClickSave,
    handleClose
  ]);
  const validationErros = useRef({});

  const isValid = useCallback(() => {
    return (
      keys(validationErros.current).length === 3 &&
      every(validationErros.current, (v) => !v)
    );
  }, [validationErros]);

  const isValueValid = useRef(isValid(userSetting));

  const onValidated = (field) => (validationError) => {
    validationErros.current[field] = validationError;

    if (isValueValid.current !== isValid()) {
      isValueValid.current = isValid();
    }
  };
  return (
    <EmoneyDrawer
      anchor="bottom"
      isOpen={drawerOpen}
      onClose={handleClose}
      classes={{ paper: 'company-drawer-paper' }}
      header={header}>
      <Grid container direction="column" className="mt-7">
        <Grid item container direction="row" spacing={6}>
          <Grid item container xs={12} md={5} justify="flex-end">
            <Grid item xs={12} md={3}>
              {!userData?.isLoading ? (
                <div className="user-photo justify-content-end d-flex justify-content-center align-items-center">
                  <span
                    className="user-photo-name font-x-large"
                    style={{ textTransform: 'uppercase' }}>
                    {userData?.firstName ? userData?.firstName.charAt(0) : ''}
                    {userData?.lastName ? userData?.lastName.charAt(0) : ''}
                  </span>
                </div>
              ) : (
                <Skeleton
                  key="photo"
                  width={100}
                  height={100}
                  variant="circle"
                />
              )}
            </Grid>
          </Grid>
          <Grid item container xs={12} md={7} direction="column">
            {!userData?.isLoading ? (
              <AdormentTextField
                fullWidth
                placeholder={intl.formatMessage({
                  id: 'user.setting.firstname.placeholder',
                  defaultMessage: 'Enter First Name'
                })}
                adormentText={intl.formatMessage({
                  id: 'emoney.firstName',
                  defaultMessage: 'First Name:'
                })}
                value={userSetting?.firstName || ''}
                onValidated={onValidated('firstName')}
                required={true}
                submitted={userInfoSubmitted}
                name="firstName"
                onChange={handleChange}
                className="w-50"

              />
            ) : (
              <Skeleton
                key="firstName"
                style={{ height: 60 }}
                variant="text"
                className="w-50"
              />
            )}
            {!userData?.isLoading ? (
              <AdormentTextField
                fullWidth
                placeholder={intl.formatMessage({
                  id: 'user.setting.lastname.placeholder',
                  defaultMessage: 'Enter Last Name'
                })}
                adormentText={intl.formatMessage({
                  id: 'emoney.lastName',
                  defaultMessage: 'Last Name:'
                })}
                value={userSetting?.lastName || ''}
                name="lastName"
                onChange={handleChange}
                className="w-50 mt-3"
                onValidated={onValidated('lastName')}
                required={true}
                submitted={userInfoSubmitted}
              />
            ) : (
              <Skeleton
                key="lastName"
                style={{ height: 60 }}
                variant="text"
                className="w-50"
              />
            )}
          </Grid>
        </Grid>
        <Grid item container direction="row" spacing={6}>
          <Grid item container xs={12} md={5} justify="flex-end"></Grid>
          <Grid item xs={12} md={7} container direction="column">
            {!userData?.isLoading ? (
              <AdormentTextField
                fullWidth
                placeholder={intl.formatMessage({
                  id: 'user.setting.email.placeholder',
                  defaultMessage: 'Enter New Email'
                })}
                adormentText={intl.formatMessage({
                  id: 'emoney.eMail:.lowercase',
                  defaultMessage: 'E-Mail:'
                })}
                value={userSetting?.email || ''}
                name="email"
                onChange={handleChange}
                className="w-50"
                onValidated={onValidated('email')}
                required={true}
                submitted={userInfoSubmitted}
                validator={Email}
                disabled={true}
              />
            ) : (
              <Skeleton
                key="email"
                style={{ height: 60 }}
                variant="text"
                className="w-50"
              />
            )}

            {userSetting?.password &&
              userSetting?.password !== '' &&
              !userData?.isLoading ? (
              <AdormentTextField
                fullWidth
                placeholder={intl.formatMessage({
                  id: 'user.setting.current.password.placeholder',
                  defaultMessage: 'Enter Current Password'
                })}
                adormentText={intl.formatMessage({
                  id: 'user.setting.current.password',
                  defaultMessage: 'Current Password:'
                })}
                value={userSetting?.opassword || ''}
                name="opassword"
                type="password"
                onChange={handleChange}
                className="w-50 mt-3"
              />
            ) : (
              ''
            )}

            {!userData?.isLoading ? (
              <AdormentTextField
                fullWidth
                placeholder={intl.formatMessage({
                  id: 'user.setting.password.placeholder',
                  defaultMessage: 'Enter New Password'
                })}
                adormentText={intl.formatMessage({
                  id: 'user.setting.password',
                  defaultMessage: 'Change Password:'
                })}
                value={userSetting?.password || ''}
                name="password"
                onChange={handleChange}
                type="password"
                className="w-50 mt-3"
              />
            ) : (
              <Skeleton
                key="password"
                style={{ height: 60 }}
                variant="text"
                className="w-50"
              />
            )}
            {userSetting?.password &&
              userSetting?.password !== '' &&
              !userData?.isLoading ? (
              <AdormentTextField
                fullWidth
                placeholder={intl.formatMessage({
                  id: 'user.setting.confirm.password.placeholder',
                  defaultMessage: 'Enter Confirm Password'
                })}
                adormentText={intl.formatMessage({
                  id: 'user.setting.confirm.password',
                  defaultMessage: 'Confirm Password:'
                })}
                value={userSetting?.cpassword || ''}
                name="cpassword"
                type="password"
                onChange={handleChange}
                className="w-50 mt-3"
              />
            ) : (
              ''
            )}
            <div className="mt-6 font-big font-bold">
              {intl.formatMessage({
                id: 'user.setting.timesetting',
                defaultMessage: 'TIME SETTINGS'
              })}
            </div>

            <div className="w-50 mt-3">
              {!userData?.isLoading ? (
                <Fragment>
                  <EmoneySelect
                    dontTranslate={true}
                    onChange={handleChangeTimeZone}
                    value={userSetting?.timezone || ''}
                    adormentText={intl.formatMessage({
                      id: 'user.setting.timezone',
                      defaultMessage: 'Time Zone'
                    })}
                    menuItems={listTimeZones()}
                  />
                </Fragment>
              ) : (
                <Skeleton
                  key="name"
                  style={{ height: 60 }}
                  variant="text"
                  className="w-50"
                />
              )}
            </div>
            <div className="w-50 mt-5 font-medium font-bold">
              {intl.formatMessage({
                id: 'user.setting.timeformart',
                defaultMessage: 'Time Format'
              })}
            </div>
            <div className="mt-2">
              {!userData?.isLoading ? (
                <RadioGroup
                  row
                  name="timeformat"
                  value={userSetting?.timeformat || '24'}
                  onChange={handleChange}>
                  <FormControlLabel
                    value="24"
                    control={<Radio color="primary" />}
                    label={intl.formatMessage({
                      id: 'emoney.24h',
                      defaultMessage: '24h'
                    })}
                    classes={{ label: 'font-medium font-bold' }}
                    labelPlacement="end"
                  />
                  <FormControlLabel
                    value="12"
                    control={<Radio color="primary" />}
                    label={intl.formatMessage({
                      id: 'emoney.12h',
                      defaultMessage: '12h'
                    })}
                    classes={{ label: 'font-medium font-bold' }}
                    labelPlacement="end"
                  />
                </RadioGroup>
              ) : (
                <Skeleton
                  key="name"
                  style={{ height: 60 }}
                  variant="text"
                  className="w-50"
                />
              )}
            </div>
            <div className="w-50 mt-3 font-medium font-bold">
              {intl.formatMessage({
                id: 'user.setting.dateformat',
                defaultMessage: 'Date Format'
              })}
            </div>
            <div className="mt-2">
              {!userData?.isLoading ? (
                <RadioGroup
                  row
                  name="dateformat"
                  value={userSetting?.dateformat || 'mdy'}
                  onChange={handleChange}>
                  <FormControlLabel
                    value="mdy"
                    control={<Radio color="primary" />}
                    label={intl.formatMessage({
                      id: 'emoney.mdy',
                      defaultMessage: 'mdy'
                    })}
                    classes={{ label: 'font-medium font-bold' }}
                    labelPlacement="end"
                  />
                  <FormControlLabel
                    value="dmy"
                    control={<Radio color="primary" />}
                    label={intl.formatMessage({
                      id: 'emoney.dmy',
                      defaultMessage: 'dmy'
                    })}
                    classes={{ label: 'font-medium font-bold' }}
                    labelPlacement="end"
                  />
                  <FormControlLabel
                    value="ymd"
                    control={<Radio color="primary" />}
                    label={intl.formatMessage({
                      id: 'emoney.ymd',
                      defaultMessage: 'ymd'
                    })}
                    classes={{ label: 'font-medium font-bold' }}
                    labelPlacement="end"
                  />
                </RadioGroup>
              ) : (
                <Skeleton
                  key="two-factor"
                  style={{ height: 60 }}
                  variant="text"
                  className="w-50"
                />
              )}
            </div>
            <div className="mt-5 font-big font-bold">
              {intl.formatMessage({
                id: 'user.setting.formatsettings',
                defaultMessage: 'Format Settings'
              })}
            </div>
            <div className="mt-4 font-medium font-bold">
              {intl.formatMessage({
                id: 'user.setting.xyformat',
                defaultMessage: 'XY Format:'
              })}
            </div>
            <div className="mt-3">
              {!userData?.isLoading ? (
                <RadioGroup
                  row
                  name="xyformat"
                  value={userSetting?.xyformat || '1'}
                  onChange={handleChange}>
                  <FormControlLabel
                    value="1"
                    control={<Radio color="primary" />}
                    label={intl.formatMessage({
                      id: 'user.setting.xyformat1',
                      defaultMessage: '0.000,00'
                    })}
                    classes={{ label: 'font-medium font-bold' }}
                    labelPlacement="end"
                  />
                  <FormControlLabel
                    value="2"
                    control={<Radio color="primary" />}
                    label={intl.formatMessage({
                      id: 'user.setting.xyformat2',
                      defaultMessage: '0,000.00'
                    })}
                    classes={{ label: 'font-medium font-bold' }}
                    labelPlacement="end"
                  />
                </RadioGroup>
              ) : (
                <Skeleton
                  key="name"
                  style={{ height: 60 }}
                  variant="text"
                  className="w-50"
                />
              )}
            </div>
            <div className="mt-4 font-big font-bold">
              {intl.formatMessage({
                id: 'user.setting.twofactor',
                defaultMessage: 'TWO-FACTOR AUTHENTICATION'
              })}
            </div>
            <div
              className="mt-3 font-medium w-75"
              style={{ wordBreak: 'break-word' }}>
              <b>
                {intl.formatMessage({
                  id: 'user.setting.mobile.authentication',
                })}
              </b>
              {intl.formatMessage({
                id: 'user.setting.twofactor.conent',
              })}
            </div>
            <Box>
              <FormControlLabel
                control={<EmoneySwitch
                  onChange={handleMFAStatus}
                  checked={mfaStatus} />}
                label={intl.formatMessage({ id: userSetting?.mfaEnabled ? 'admin.user.table.header.detail.deotp' : 'admin.user.table.header.detail.acotp' })}
              />
              {isDisabling && (
                <FontAwesomeIcon
                  icon={faSpinner}
                  className="fa-spin"
                  size="lg"
                />
              )
              }
            </Box>
            {
              mfaStatus && !userSetting?.mfaEnabled ? (
                <Box mt={4} className={classes.MFAContainer}>
                  <MFACard onCancel={handleCloseMFACard} mfaStatus={mfaStatus} currentMFAStatus={userSetting?.mfaEnabled} handleEnabled={handleEnabledMFA} />
                </Box>
              ) : mfaStatus && userSetting?.mfaEnabled && (
                <Box className="w-50">
                  <AdormentTextField
                    fullWidth
                    placeholder={intl.formatMessage({
                      id: 'otp.code.title',
                    })}
                    adormentText={intl.formatMessage({ id: 'otp.code.title:' })}
                    name="otpcode"
                    value={otpCode}
                    required={true}
                    submitted={submitted}
                    type="number"
                    onValidated={onValidateOtpCode('optcode')}
                    onChange={(event) => setOtpCode(event.target.value)}
                  />
                </Box>
              )
            }
            {
              isJustEnabled && (
                <Box className={classes.otpNotification} mt={3} display="flex" justifyContent="center" alignItems="center">
                  <span className={classes.otpSuccssContent}>{intl.formatMessage({ id: 'user.setting.mfa.enabled' })}</span>
                </Box>
              )
            }

          </Grid>
        </Grid>
      </Grid>
    </EmoneyDrawer>
  );
};
const state = createStructuredSelector({
  userData: getUser
});

export default connect(state)(withTheme(injectIntl(withMemo(UserSetting))));
