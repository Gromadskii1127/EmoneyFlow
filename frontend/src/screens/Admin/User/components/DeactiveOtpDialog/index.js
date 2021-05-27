import React, { useCallback, useState } from 'react';
import {
  Dialog, Button
} from '@material-ui/core';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect'
import { withMemo } from 'components/HOC';
import CloseIcon from '@material-ui/icons/Close';
import { injectIntl } from 'react-intl';
import * as AdminUserActions from 'redux/actions/AdminUserActions';
import { LoadingButton } from 'components';

const DeactiveOtpDialog = ({ dispatch, onClose, selectedValue, rowData, open, intl, ...props }) => {

  const [isLoading, setIsLoading] = useState(false);
  const handleClose = useCallback(() => {
    if (!isLoading) {
      onClose(false);
    }

  }, [onClose, isLoading]);

  const handleClick = useCallback((event) => {
    console.log('user iD = ', rowData);
    setIsLoading(true);
    dispatch(AdminUserActions.setMFA(rowData.id, rowData.mfaStatus)).then(response => {
      setIsLoading(false);
      if (response?.payload?.status === 200) {
        onClose(true);
      }      
    });

  }, [dispatch, rowData, onClose]);

  return (
    <Dialog onClose={handleClose} aria-labelledby="reset-dialog-title" open={open} classes={{ paper: "user-dialog" }}>
      <div className="user-dialog-content d-flex flex-column">
        <div className="d-flex flex-row-reverse">
          <Button onClick={handleClose} className="user-dialog-button-close">
            <CloseIcon fontSize={"large"} />
          </Button>
        </div>
        <div className="d-flex flex-row justify-content-center user-dialog-icon-container">
          <span className="emicon-warning user-dialog-icon" />
        </div>
        <div className="d-flex flex-row justify-content-center user-dialog-title">
          {intl.formatMessage({ id: "admin.user.dialog.dotp.title", defaultMessage: "Deactivate OTP" })}
        </div>
        <div className="d-flex flex-row justify-content-center user-dialog-content">
          {intl.formatMessage({ id: "admin.user.dialog.dotp.content", defaultMessage: "Deactivate User OTP code authentication" })}
        </div>
        <div className="d-flex flex-row justify-content-center user-dialog-button-container">
          <LoadingButton
            isLoading={isLoading}
            disabled={isLoading}
            onClick={() => handleClick(true)}
            className="user-dialog-button user-dialog-button-red">
            {intl.formatMessage({ id: "emoney.deactivate", defaultMessage: "Deactivate" })}
          </LoadingButton>
        </div>
      </div>
    </Dialog>
  );
}
const state = createStructuredSelector({});
export default connect(state)(injectIntl(withMemo(DeactiveOtpDialog)));