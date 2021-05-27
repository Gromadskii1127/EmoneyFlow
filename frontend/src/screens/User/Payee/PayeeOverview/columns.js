import { useState, useCallback, useRef, useEffect } from 'react';
import {
  IconButton,
  Popper,
  Grow,
  Paper,
  ClickAwayListener,
  MenuList
} from '@material-ui/core';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';

import { DropdownMenuItem } from 'components/EmoneyMenu/components';

const PayeeColumns = (intl, onEdit, onDelete) => {
  const convertMethod = useCallback((method) => {
    return method === 0
      ? 'method.SEPA'
      : method === 1
        ? 'method.OCTARUSSIA'
        : method === 2
          ? 'method.CCUSA'
          : method === 3
            ? 'method.CCEUROPA'
            : method === 4
              ? 'method.CCPAGAFLEX'
              : method === 5
                ? 'method.COMXBANK'
                : method === 6
                  ? 'method.MXPAGEFLEX'
                  : 'method.SEPA';
  }, []); 

  return [
    {
      title: intl.formatMessage({
        id: 'emoney.affiliateId'
      }),
      name: 'affiliateId'
    },
    {
      title: intl.formatMessage({
        id: 'emoney.name'
      }),
      name: 'name',
      Cell: (row, column, value) => {
        return row['firstName'] + '  ' + row['lastName'];
      }
    },

    {
      title: intl.formatMessage({
        id: 'emoney.method'
      }),
      name: 'method',
      Cell: (row, _2, value) => {
        return intl.formatMessage({ id: convertMethod(row['method']) });
      }
    },
    {
      title: intl.formatMessage({
        id: 'emoney.iban'
      }),
      name: 'iban'
    },
    {
      title: '',
      name: '',
      width: '50px',
      Cell: (row, column, value) => {
        const [open, setOpen] = useState(false);
        const anchorRef = useRef(null);
        const containerRef = useRef(null);
        const handleToggle = useCallback(
          (event) => {
            event.stopPropagation();
            setOpen(true);
          },
          []
        );
        const handleClose = useCallback(
          (event) => {
            if (anchorRef.current && anchorRef.current.contains(event.target)) {
              return;
            }
            setOpen(false);
          },
          [anchorRef]
        );
        const handleListKeyDown = useCallback((event) => {
          if (event.key === 'Tab') {
            event.preventDefault();
            setOpen(false);
          }
        }, []);
        const onClickHandler = useCallback((e) => {
          if (
            containerRef &&
            containerRef.current != null &&
            containerRef.current.contains(e.target)
          ) {
            return;
          }
          setOpen(false);
        }, []);
        useEffect(() => {
          document.addEventListener('mousedown', onClickHandler);
          return () => {
            document.removeEventListener('mousedown', onClickHandler);
          };
        }, [onClickHandler]);
        return (
          <div ref={containerRef}>
            <IconButton style={{ padding: 0 }} onClick={handleToggle} ref={anchorRef} aria-haspopup="true">
              <MoreHorizIcon />
            </IconButton>
            <Popper
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
                      <MenuList
                        autoFocusItem={open}
                        id="row-menu-list-grow"
                        onKeyDown={handleListKeyDown}>
                        <DropdownMenuItem
                          icon={'emicon-edit'}
                          text={intl.formatMessage({
                            id: 'header.menu.edit'
                          })}
                          onClick={() => onEdit(row)}
                        />
                        <DropdownMenuItem
                          icon={'emicon-delete'}
                          text={intl.formatMessage({
                            id: 'header.menu.delete'
                          })}
                          onClick={() => onDelete(row)}
                        />
                      </MenuList>
                    </ClickAwayListener>
                  </Paper>
                </Grow>
              )}
            </Popper>
          </div>
        );
      }
    }
  ];
};

export default PayeeColumns;
