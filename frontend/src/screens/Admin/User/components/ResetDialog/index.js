import React, { useState, useCallback, } from 'react';
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
const ResetDialog = ({ dispatch, onClose, selectedValue, rowData, open, intl, ...props }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClose = useCallback(() => {
    if (!isLoading) {
      onClose(false);
    }

  }, [onClose, isLoading]);

  const handleReset = useCallback((event) => {
    console.log('user iD = ', rowData);
    setIsLoading(true);
    dispatch(AdminUserActions.resetPassword(rowData.id)).then(response => {
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
          <span className="emicon-rest-password user-dialog-icon" />
        </div>
        <div className="d-flex flex-row justify-content-center user-dialog-title">
          {intl.formatMessage({ id: "admin.user.dialog.reset.title", defaultMessage: "Reset Password" })}
        </div>
        <div className="d-flex flex-row justify-content-center user-dialog-content">
          {intl.formatMessage({ id: "admin.user.dialog.reset.content", defaultMessage: "Send user new password by email" })}
        </div>
        <div className="d-flex flex-row justify-content-center user-dialog-button-container">
          <LoadingButton
            isLoading={isLoading}
            disabled={isLoading}
            onClick={() => handleReset(true)}
            className="user-reset-dialog-button">
            {intl.formatMessage({ id: "admin.user.dialog.reset.title", defaultMessage: "Reset Password" })}
          </LoadingButton>
        </div>
      </div>
    </Dialog>
  );
}
const state = createStructuredSelector({});
export default connect(state)(injectIntl(withMemo(ResetDialog)));