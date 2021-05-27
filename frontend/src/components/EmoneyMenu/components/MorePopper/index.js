import { useRef, useState, useEffect, useCallback } from 'react';
import {
  ClickAwayListener,
  Popper,
  Paper,
  Grow,
  IconButton
} from '@material-ui/core';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';

const MorePopper = ({onOpen, children}) => {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);
  const containerRef = useRef(null);
  const onOpenChange = useCallback((isOpen) => {
    setOpen(isOpen);
    onOpen && onOpen(isOpen);
  }, [onOpen]);

  const handleListKeyDown = useCallback((event) => {
    if (event.key === 'Tab') {
      event.preventDefault();
      onOpenChange(false);
    }
  }, [onOpenChange]);
  const handleToggle = useCallback(
    (event) => {
      event.stopPropagation();
      //setOpen(true);
      onOpenChange(true);
    },
    [onOpenChange]
  );
  const handleClose = useCallback(
    (event) => {
      if (anchorRef.current && anchorRef.current.contains(event.target)) {
        return;
      }
      //setOpen(false);
      onOpenChange(false);
    },
    [anchorRef, onOpenChange]
  );
  const onClickHandler = useCallback((e) => {
    if (
      containerRef &&
      containerRef.current != null &&
      containerRef.current.contains(e.target)
    ) {
      return;
    }
    onOpenChange(false);
  }, [onOpenChange]);

  useEffect(() => {
    document.addEventListener('mousedown', onClickHandler);
    return () => {
      document.removeEventListener('mousedown', onClickHandler);
    };
  }, [onClickHandler]);

  return (
    <div onKeyDown={handleListKeyDown} style={{textAlign: 'right' }} ref={containerRef}>
      <IconButton size="medium" onClick={handleToggle} ref={anchorRef} aria-haspopup="true">
        <MoreHorizIcon />
      </IconButton>

      <Popper
        className="mt-3"
        open={open}
        anchorEl={anchorRef?.current}
        role={undefined}
        transition
        placement="bottom-end"
      >
        {({ TransitionProps, placement }) => (
          <Grow {...TransitionProps} style={{ transformOrigin: 'bottom' }}>
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                {children}
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </div>
  )
}

export default MorePopper;