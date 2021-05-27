import React, { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { AppBar, MenuList, Popper, Button, Paper, Grow, ClickAwayListener } from '@material-ui/core';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect'
import { injectIntl } from 'react-intl';
// Project Components
import { withMemo } from 'components/HOC';
import { DropdownMenuItem } from 'components/EmoneyMenu/components';
import { getUser } from 'redux/selectors/UserSelector';
// Redux Action
import * as UserActions from 'redux/actions/UserActions';

const Header = ({ title, intl, dispatch, handleOpenSetting, userData, ...props }) => {
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);
  // handler
  const handleToggle = useCallback(() => {
    setOpen((prevOpen) => !prevOpen);
  }, []);
  const handleClose = useCallback((event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  }, [anchorRef, setOpen]);

  const handleSetting = useCallback((event) => {     
    if (handleOpenSetting) {      
      handleOpenSetting(event);
    }
  }, [handleOpenSetting]);

  const handleLogout = useCallback(async (event) => {
    setOpen(false);
    event.preventDefault();
    try {
      await dispatch(
        UserActions.logout()
      );
    } catch {

    }
  }, [dispatch]);
  const handleListKeyDown = useCallback((event) => {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpen(false);
    }
  }, []);

  return (
    <div className="app-header-container ">
      <AppBar
        position="fixed"
        className="app-header header-nav-wrapper header-nav-wrapper-lg w-100 navbar-dark d-flex align-items-center justify-content-between bg-header"
      >
        <div className="nav-logo d-flex">
          <Link to="/" className="header-logo" />
          <div className="ml-4 page-title">{title}</div>
        </div>
        <div className="d-flex flex-row justify-content-end">
          <div className="header-user-image d-flex justify-content-center align-items-center normal-font-size font-light">
            { userData?.firstName ? userData?.firstName.charAt(0) : ''}{ userData?.lastName ? userData?.lastName.charAt(0) : ''}            
          </div>
          <div className="d-flex flex-row align-items-center justify-content-center">
            <Button
              ref={anchorRef}
              aria-controls={open ? 'menu-list-grow' : undefined}
              aria-haspopup="true"
              onClick={handleToggle}
              className="d-flex flex-column"
            >
              <span className="small-little font-light header-user-name">{ userData?.firstName || ''}{' '}{ userData?.lastName || ''}</span>
              <FontAwesomeIcon icon={faChevronDown} className="ml-1 header-user-name" />
            </Button>
            <Popper className="mt-3" open={open} anchorEl={anchorRef.current} role={undefined} transition>
              {({ TransitionProps, placement }) => (
                <Grow
                  {...TransitionProps}
                  style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
                >
                  <Paper>
                    <ClickAwayListener onClickAway={handleClose}>
                      <MenuList autoFocusItem={open} id="menu-list-grow" onKeyDown={handleListKeyDown}>
                        <DropdownMenuItem onClick={handleSetting} icon={"emicon-user"} text={intl.formatMessage({ id: "header.menu.settings", defaultMessage: "Settings" })} />
                        <DropdownMenuItem onClick={handleLogout} icon={"emicon-lock"} text={intl.formatMessage({ id: "header.menu.logout", defaultMessage: "Log out" })} />
                      </MenuList>
                    </ClickAwayListener>
                  </Paper>
                </Grow>
              )}
            </Popper>
          </div>
        </div>
      </AppBar>
    </div>
  )
}
const state = createStructuredSelector({
  userData: getUser
});
export default connect(state)(withMemo(injectIntl(Header)));
