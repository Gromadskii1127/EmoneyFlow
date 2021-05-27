import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
// Components
import { withMemo } from 'components/HOC';
import { Drawer, Tooltip, IconButton } from '@material-ui/core';
// Icons
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';
import CloseIcon from '@material-ui/icons/Close';
import { CopyToClipboard } from 'react-copy-to-clipboard';

const TransactionDetailDrawer = ({ drawerOpen, close, intl, description, selectedRow }) => {

  const handleClickedCopy = useCallback((e) => {

  }, [])
  return (
    <Drawer
      anchor="bottom"
      open={drawerOpen}
      onClose={close}
      classes={{ paper: 'trans-drawer' }}>
      <div className="trans-drawer-container">
        <div className="trans-drawer-content d-flex flex-column p-3">
          <div className="trans-drawer-content-header d-flex flex-row-reverse align-items-center">
            <Tooltip
              classes={{
                tooltip: 'trans-drawer-button-tooltip',
                arrow: 'trans-drawer-button-arrow'
              }}
              arrow
              title={intl.formatMessage({
                id: 'admin.transaction.drawer.button.tooltip.close',
                defaultMessage: 'Close'
              })}
              placement="top">
              <IconButton
                aria-label="delete"
                size="medium"
                className="trans-drawer-top-button"
                onClick={close}>
                <CloseIcon fontSize="large" />
              </IconButton>
            </Tooltip>
            <Tooltip
              classes={{
                tooltip: 'trans-drawer-button-tooltip',
                arrow: 'trans-drawer-button-arrow'
              }}
              arrow
              title={intl.formatMessage({
                id: 'admin.transaction.drawer.button.tooltip.copy',
                defaultMessage: 'Copy to Clipboard'
              })}
              placement="top">
              <CopyToClipboard text={JSON.stringify(selectedRow)}
              >
                <IconButton
                  variant="contained"
                  aria-label="delete"
                  size="medium"
                  className="trans-drawer-top-button"
                  onClick={handleClickedCopy}
                >
                  <FileCopyOutlinedIcon fontSize="large" />
                </IconButton>
              </CopyToClipboard>

            </Tooltip>
          </div>
          <div className="flex-grow-1 pr-5 pl-5 d-flex flex-column">
            <div className="trans-drawer-content-title">
              {intl.formatMessage({
                id: 'admin.transaction.drawer.title',
                defaultMessage: 'TRANSACTION DETAILS'
              })}
            </div>

            <div className="trans-drawer-content-content">
              <pre>{JSON.stringify(selectedRow, null, 2)}</pre>
            </div>

          </div>
        </div>
      </div>
    </Drawer>
  );
};

TransactionDetailDrawer.propTypes = {
  // flag to open or close drawer
  drawerOpen: PropTypes.bool.isRequired,
  // handler function to close drawer
  close: PropTypes.func.isRequired,
};

export default injectIntl(withMemo(TransactionDetailDrawer));
