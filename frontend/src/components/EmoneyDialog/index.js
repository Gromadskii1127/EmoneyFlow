import React, { useCallback } from 'react';
import { Dialog, DialogActions, DialogTitle, DialogContent } from '@material-ui/core';
import { injectIntl, FormattedMessage } from 'react-intl';
import { makeStyles, } from '@material-ui/core/styles';

import { LoadingButton } from 'components';
import { withMemo } from 'components/HOC';
import { ENUMS } from 'constant';
const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: '600px'
  },
  button: {
    background: 'red',

  }
}));


const EmoneyDialog = ({ intl, isLoading, open, onClose, title, content, actions, data, ...props }) => {
  const classes = useStyles();  
  const handleClose = useCallback(() => {
    onClose(false);
  }, [onClose]);
  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="reset-dialog-title"
      open={open}
      classes={{root: classes.root}}
      fullWidth
    >
      <DialogTitle>
        {title}
      </DialogTitle>
      <DialogContent>
        {content}
      </DialogContent>
      <DialogActions>
        {
          actions.map((action, index) => (
            <LoadingButton
              aria-label="close"
              size="medium"
              disabled={isLoading}
              isLoading={action.type === ENUMS.DialogButtonType.YES.type ? isLoading : false}
              key={index}
              onClick={event => onClose(action.type, data)}>
              <FormattedMessage
                id={action.text}                
              />
            </LoadingButton>
          ))
        }

      </DialogActions>
    </Dialog>
  );
};
export default injectIntl(withMemo(EmoneyDialog));
