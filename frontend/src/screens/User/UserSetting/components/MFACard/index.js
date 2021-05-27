import React, { useCallback, useState, useEffect, useRef } from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { withTheme, makeStyles } from '@material-ui/core/styles';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import {
  Card,
  CardContent,
  CardActions,
  Box,
  Link,
  Collapse
} from '@material-ui/core';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { getUser } from 'redux/selectors/UserSelector';
import { createStructuredSelector } from 'reselect';
import { withMemo } from 'components/HOC';
import { Skeleton } from '@material-ui/lab';
import { AdormentTextField, LoadingButton } from 'components';
import { addError } from 'redux/actions/ErrorActions';
import {
  getQRCode,
  enableMFA,
  setMFAEnabled,
} from 'redux/actions/UserActions';


const useStyles = makeStyles({
  root: ({ theme }) => ({
    width: '100%',
    height: '100%',
    background: theme.palette.card.background,
    borderRadius: theme.card.borderRadius,
    padding: 13,
  }),
  link: ({ theme }) => ({
    color: `${theme.palette.primary.main} !important`,
    marginTop: -5,
    marginRight: 0,
    textDecoration: 'underline !important'
  }),

  clickToCopylink: ({ theme }) => ({
    color: 'primary',
    fontSize: theme.font.size.small,
    border: '0px solid',
    padding: 0,
    backgroundColor: 'transparent'
  }),
  copiedKey: ({ theme }) => ({
    color: theme.palette.text.copiedColor,
    fontSize: theme.font.size.small
  }),
  keyCardRoot: ({ theme }) => ({
    padding: 0
  }),
  keyCardContent: ({ theme }) => ({
    padding: '5px !important',
    fontSize: '11px',
    backgroundColor: theme.palette.card.subCardBackColor
  })
})
const MFACard = ({ dispatch, intl, onCancel, mfaStatus, handleEnabled, currentMFAStatus, theme }) => {
  const classes = useStyles({ theme })
  const [otpCode, setOtpCode] = useState('');
  const [checked, setChecked] = useState(false);
  const [mfaImage, setMfaImage] = useState('');
  const [isQRLoading, setIsQRLoading] = useState(false);
  const [securityCode, setSecurityCode] = useState('');
  const [isCopiedKey, setIsCopiedKey] = useState(false);
  const [savePromise, setSavePromise] = useState();
  const [submitted, setSubmitted] = useState(false);
  const validationErrors = useRef({});
  const handleClickCancel = useCallback((event) => {
    event.preventDefault();
    if (onCancel) {
      onCancel()
    }
  }, [onCancel]);

  const handleSaved = useCallback((event) => {

  }, []);

  const handleClickSave = useCallback((event) => {
    setSubmitted(true);
    if (!validationErrors.current['otpcode'] && otpCode !== "") {
      setSavePromise(
        dispatch(enableMFA(otpCode)).then((response) => {
          if (response?.payload?.status === 200) {
            dispatch(setMFAEnabled(true));
            if (handleEnabled) handleEnabled()
          } else {
            dispatch(addError({ type: 0, message: intl.formatMessage({ id: 'user.setting.mfa.error' }), from: 'UserSetting' }));
          }
        })
      )
    }

  }, [validationErrors, dispatch, otpCode, handleEnabled, intl]);

  const onValidateOtpCode = (field) => (validationError) => {
    validationErrors.current[field] = validationError;
  }

  useEffect(() => {
    setSavePromise(null);
    setIsQRLoading(true);
    console.log('mfaStatus = ', mfaStatus)
    if (mfaStatus && !currentMFAStatus) {
      dispatch(getQRCode()).then((response) => {
        setIsQRLoading(false);
        setMfaImage(response.payload?.data?.image || '');
        setSecurityCode(response.payload?.data?.code || '');
        setIsCopiedKey(false);
      });
    }

  }, [dispatch, mfaStatus, currentMFAStatus])
  return (
    <Card className={classes.root} variant="outlined">
      <Box display="flex" flexDirection="row-reverse">
        <Link href='#' onClick={handleClickCancel} underline='always' className={classes.link}>{intl.formatMessage({ id: 'emoney.cancel' })}</Link>
      </Box>
      <CardContent>
        <Box display="flex" flexDirection="column">
          <Box>
            <b>1.</b> {' '} {intl.formatMessage({ id: 'user.setting.mfa.comment.1' })}
          </Box>
          <Box mt={3}>
            <b>2.</b>{' '} {intl.formatMessage({ id: 'user.setting.mfa.comment.2' })}
          </Box>
          <Box mt={2}>
            {
              isQRLoading ? (
                <Skeleton
                  key="image"
                  variant="rect"
                  width={250}
                  height={200}
                />
              ) : (
                <img src={mfaImage} alt="QR" />
              )
            }

          </Box>
          <Box mt={5}>
            <b>3.</b>{' '} {intl.formatMessage({ id: 'user.setting.mfa.comment.3' })}
          </Box>
          <Box mt={1}>
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

          <Box mt={5}>
            <Link href='#'
              onClick={(event) => setChecked(!checked)}
              className={classes.link}>
              {intl.formatMessage({ id: 'user.setting.mfa.comment.5' })}
              <ArrowDropDownIcon />
            </Link>
            <Collapse in={checked}>
              <Box display="flex" flexDirection="column" mt={1}>
                <Box>{intl.formatMessage({ id: 'user.setting.mfa.comment.6' })}</Box>
                <Box mt={1}>
                  {
                    !isQRLoading ? (
                      <Card className={classes.keyCardRoot}>
                        <CardContent className={classes.keyCardContent}>
                          {securityCode}
                        </CardContent>
                      </Card>
                    ) : (
                      <Skeleton name="security" variant="rect" height={60} ></Skeleton>
                    )
                  }

                </Box>
                <Box mt={1}>
                  <CopyToClipboard text={securityCode}
                    onCopy={() => setIsCopiedKey(true)}
                  >

                    {
                      !isCopiedKey ? (
                        <button className={classes.clickToCopylink}>{intl.formatMessage({ id: 'emoney.click.to.copy' })}</button>
                      ) : (
                        <span></span>
                      )
                    }

                  </CopyToClipboard>
                  {
                    isCopiedKey && (
                      <span className={classes.copiedKey}> {intl.formatMessage({ id: 'emoney.copied.text' })}</span>
                    )
                  }
                </Box>
              </Box>
            </Collapse>
          </Box>
        </Box>
      </CardContent>
      <CardActions>
        <LoadingButton
          loadingPromise={savePromise}
          onLoadingCompleted={handleSaved}
          aria-label="close"
          size="medium"
          onClick={handleClickSave}>
          <FormattedMessage
            id="user.setting.enable.mfa"
          />
        </LoadingButton>
      </CardActions>
    </Card>
  )
}
const state = createStructuredSelector({
  userData: getUser
});

export default connect(state)(injectIntl(withTheme(withMemo(MFACard))));