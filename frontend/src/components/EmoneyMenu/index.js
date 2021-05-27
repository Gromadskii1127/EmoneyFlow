import React, { Fragment, useEffect, useState, useRef, useCallback } from 'react';
import {
  Button, ClickAwayListener, Popper, Paper, Grow, MenuList
} from '@material-ui/core';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect'

// Project Components
import { withMemo } from 'components/HOC';
import { DropdownMenuItem } from './components';

const EmoneyMenu = ({ row, column, value, menuDatas, buttonComponent, handleClick, ...props }) => {
  const anchorRef = useRef(null);
  const containerRef = useRef(null);
  const [open, setOpen] = useState(false);

  // Handler
  const handleToggle = useCallback((event) => {
    setOpen(true);
    event.stopPropagation();
  }, []);

  const handleClose = useCallback((event, menuItem) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    setOpen(false);
    handleClick(row, column, value, menuItem);
  }, [row, column, value, anchorRef, handleClick]);

  const handleListKeyDown = useCallback((event) => {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpen(false);
    }
  }, []);
  
  const onClickHandler = useCallback((e) => {
    if (containerRef && containerRef.current !== null && containerRef.current.contains(e.target)) {
      return;
    }
    setOpen(false);
  }, []);

  //Effect

  useEffect(() => {
    document.addEventListener("mousedown", onClickHandler);
    return () => {
      document.removeEventListener("mousedown", onClickHandler);
    }
  }, [onClickHandler]);

  
  return (
    <Fragment>
      <div ref={containerRef}>
        <Button
          ref={anchorRef}
          aria-controls={open ? 'row-menu-list-grow' : undefined}
          aria-haspopup="true"
          onClick={handleToggle}
          className="d-flex flex-column"
        >
          {buttonComponent}
        </Button>
        <Popper
          className="mt-3"
          open={open}
          anchorEl={anchorRef.current}
          transition
          placement="bottom-end"
          >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{ transformOrigin: 'bottom' }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList autoFocusItem={open} id="row-menu-list-grow" onKeyDown={handleListKeyDown}>
                    {
                      menuDatas.map((menuItem, index) => (
                        <DropdownMenuItem key={"menuItem-" + index} onClick={(event) => handleClose(event, menuItem)} icon={menuItem.icon} text={menuItem.text} />
                      ))
                    }

                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </div>
    </Fragment>
  )
}
const state = createStructuredSelector({});
export default connect(state)(withMemo(EmoneyMenu));