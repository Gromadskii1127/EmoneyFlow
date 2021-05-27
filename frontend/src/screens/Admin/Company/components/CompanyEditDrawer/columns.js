import _ from 'lodash';
import React, { useCallback, useState, Fragment, useRef, useEffect } from 'react';
import { replaceElement, getIndexInArray , getDataInArray} from 'utils/array_utils';
import {
  Button,
  IconButton,
  Grow,
  Paper,
  ClickAwayListener,
  MenuList,
  Popper
} from '@material-ui/core';
import {
  PaymentMethodSelect,
  AdormentTextField,
  EmoneySelect,
  EmoneySwitch,

} from 'components';
// icons
import CloseIcon from '@material-ui/icons/Close';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
// constants
import { methodValues } from 'constant';
// utils
import { checkErrorObjValidated } from 'utils/array_utils';
import { Email } from 'components/AdormentTextField/validators';
import { DropdownMenuItem } from 'components/EmoneyMenu/components';

const findRValueByValue = (value) => {
  for (var i = 0; i < methodValues.length; i++) {
    if (methodValues[i].value === value) {
      return methodValues[i].rvalue;
    }
  }
  return 0;
};

const findValueByRValue = (value) => {
  for (var i = 0; i < methodValues.length; i++) {
    if (methodValues[i].rvalue === value) {
      return methodValues[i].value;
    }
  }
  return 'sepa';
};

// Company API Columns
export const CompanyAPIColumns = (
  intl,
  editingApiRowDatas,
  setEditingApiRowIds,
  setEditingApiRowDatas,
  companyInfo,
  setCompanyInfo,
  handleApiMenuItemClick,

) => {
  const handleAction = (rowId, isCancel = true) => {
    let index = getIndexInArray(editingApiRowDatas, 'id', rowId);
    if (index !== -1) {
      let rowData = editingApiRowDatas[index];
      setEditingApiRowIds((prev) =>
        [].concat(prev.slice(0, index), prev.slice(index + 1))
      );
      setEditingApiRowDatas((prev) =>
        [].concat(prev.slice(0, index), prev.slice(index + 1))
      );
      if (isCancel) {
        // action to cancel
        let listIndex = getIndexInArray(companyInfo?.apis, 'id', rowId);
        let newDatas = [];
        if (rowData.isEditing) {
          newDatas = [rowData];
        }
        setCompanyInfo((companyInfo) => ({
          ...companyInfo,
          apis: [].concat(
            companyInfo?.apis.slice(0, listIndex),
            newDatas,
            companyInfo?.apis.slice(listIndex + 1)
          )
        }));
      }
    } else {
      // action to save result
      const updatedDatas = replaceElement(
        companyInfo.apis,
        'id',
        rowId,
        'isSaved',
        true
      );
      setCompanyInfo((companyInfo) => ({
        ...companyInfo,
        apis: updatedDatas
      }));
    }
  };

  const handleErrorChange = (field, rowId, prevError, errorResult) => {
    const selectedRow = getDataInArray(companyInfo?.apis, 'id', rowId);
    const errors = selectedRow['errors'] || {};
    errors[field] = errorResult;
    replaceElement(companyInfo?.apis, 'id', rowId, 'errors', errors);
    replaceElement(companyInfo?.apis, 'id', rowId, 'canContinue', checkErrorObjValidated(errors));
  };

  return [
    {
      title: '',
      name: '',
      shouldShow: false,
      width: '3px',
      EditingCell: (props) => {
        /**
         * API Close Editing Column
         */
        const handleClick = useCallback(() => {
          handleAction(props.row.id);
        }, [props]);

        return (
          <td
            className="MuiTableCell-root pt-2 m-0"
            style={{ verticalAlign: 'top' }}>
            <div onClick={handleClick} style={{cursor: 'pointer'}}>
              <CloseIcon />
            </div>
          </td>
        );
      }
    },
    {
      title: intl.formatMessage({
        id: 'admin.user.drawer.api.title',
        defaultMessage: 'API'
      }),
      name: 'apiType',
      width: '15px',
      shouldShow: true,
      Cell: (row, column, value) => {
        const findObjectByValue = useCallback(() => {
          for (var i = 0; i < methodValues.length; i++) {
            if (methodValues[i].rvalue === row['apiType']) {
              return methodValues[i].name;
            }
          }
          return 'method.SEPA';
        }, [row]);

        return (
          <div>
            <div>{intl.formatMessage({ id: findObjectByValue() })}</div>
          </div>
        );
      },
      EditingCell: (props) => {
        /**
         * API Edit Column
         */
        const [value, setValue] = useState(
          findValueByRValue(props.row[props.column.name])
        );

        const handleValueChange = useCallback(
          (val) => {
            setValue(val.target.value);
            // update parent's data.
            replaceElement(
              companyInfo.apis,
              'id',
              props.row.id,
              props.column.name,
              findRValueByValue(val.target.value)
            );
          },
          [props]
        );

        return (
          <td
            className="MuiTableCell-root pt-2"
            style={{ verticalAlign: 'top' }}>
            <PaymentMethodSelect onChange={handleValueChange} value={value} />
          </td>
        );
      }
    },
    {
      title: intl.formatMessage({
        id: 'admin.user.drawer.api.table.apiconf',
        defaultMessage: 'API CONFIGURATION'
      }),
      name: 'apiUsername',
      shouldShow: true,
      width: '30px',
      EditingCell: (props) => {
        /**
         * API Configuration Column
         */
        const [conf, setConf] = useState({
          apiUsername: props.row['apiUsername'] || '',
          apiPassword: props.row['apiPassword'] || '',
          merchantId: props.row['merchantId'] || '',
          connectorId: props.row['connectorId'] || '',
          apitenant: props.row['apitenant'] || ''
        });
        const [showPwd, setShowPwd] = useState(false);
        const errors = props.row['errors'];

        const handleValueChange = useCallback(
          (event) => {
            setConf(
              _.extend({}, conf, {
                [event.target.name]: event.target.value
              })
            );
            // update row data.
            replaceElement(
              companyInfo.apis,
              'id',
              props.row.id,
              event.target.name,
              event.target.value
            );
          },
          [conf, props.row.id]
        );

        const handleClickShowPassword = useCallback(() => {
          setShowPwd(!showPwd);
        }, [showPwd]);

        const handleMouseDownPassword = useCallback((event) => {
          event.preventDefault();
        }, []);

        return (
          <td
            className="emoney-table-td MuiTableCell-root"
            style={{ verticalAlign: 'top' }}>
            <AdormentTextField
              fullWidth
              placeholder={intl.formatMessage({
                id: 'required.field',
                defaultMessage: 'Rquired Field'
              })}
              adormentText={intl.formatMessage({
                id: 'admin.company.drawer.api.tenantName',
                defaultMessage: 'TenantName:'
              })}
              value={conf.apitenant || ''}
              name="apitenant"
              onChange={handleValueChange}
              className="mt-2 mb-2 company-normal-textfield"
              required
              onValidated={(value) =>
                handleErrorChange('apitenant', props.row.id, errors, value)
              }
              submitted={props.row['submitted']}
            />
            <AdormentTextField
              fullWidth
              placeholder={intl.formatMessage({
                id: 'required.field',
                defaultMessage: 'Rquired Field'
              })}
              adormentText={intl.formatMessage({
                id: 'admin.company.drawer.api.username',
                defaultMessage: 'Username:'
              })}
              value={conf.apiUsername || ''}
              name="apiUsername"
              onChange={handleValueChange}
              className="mt-2 mb-2 company-normal-textfield"
              required
              onValidated={(value) =>
                handleErrorChange('apiUsername', props.row.id, errors, value)
              }
              submitted={props.row['submitted']}
            />

            <AdormentTextField
              fullWidth
              placeholder={intl.formatMessage({
                id: 'required.field',
                defaultMessage: 'Rquired Field'
              })}
              adormentText={intl.formatMessage({
                id: 'admin.company.drawer.api.password',
                defaultMessage: 'Contact Person:'
              })}
              type={showPwd ? 'text' : 'password'}
              endAdornment={
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}>
                  {showPwd ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              }
              value={conf.apiPassword || ''}
              name="apiPassword"
              onChange={handleValueChange}
              className="mt-2 mb-2 company-normal-textfield"
              required
              onValidated={(value) =>
                handleErrorChange('apiPassword', props.row.id, errors, value)
              }
              submitted={props.row['submitted']}
            />

            <AdormentTextField
              fullWidth
              placeholder={intl.formatMessage({
                id: 'required.field',
                defaultMessage: 'Rquired Field'
              })}
              adormentText={intl.formatMessage({
                id: 'emoney.merchantId',
                defaultMessage: 'MerchantId:'
              })}
              value={conf.merchantId || ''}
              name="merchantId"
              onChange={handleValueChange}
              className="mt-2 mb-2 company-normal-textfield"
              required
              onValidated={(value) =>
                handleErrorChange('merchantId', props.row.id, errors, value)
              }
              submitted={props.row['submitted']}
            />

            <AdormentTextField
              fullWidth
              placeholder={intl.formatMessage({
                id: 'required.field',
                defaultMessage: 'Rquired Field'
              })}
              adormentText={intl.formatMessage({
                id: 'emoney.connectorId',
                defaultMessage: 'ConnectorId:'
              })}
              value={conf.connectorId || ''}
              name="connectorId"
              onChange={handleValueChange}
              className="mt-2 mb-2 company-normal-textfield"
              required
              onValidated={(value) =>
                handleErrorChange('connectorId', props.row.id, errors, value)
              }
              submitted={props.row['submitted']}
            />
          </td>
        );
      }
    },

    {
      title: intl.formatMessage({
        id: 'emoney.fees',
        defaultMessage: 'FEES'
      }),
      name: 'feeType',
      shouldShow: true,
      width: '10px',
      Cell: (row, column) => {
        return (
          <Fragment>
            {intl.formatNumber(row['amount'], {
              style: 'currency',
              currency: row.feeType ? row.feeType : 'EUR'
            })}
          </Fragment>
        );
      },
      EditingCell: (props) => {
        /**
         * Fees
         */
        const [value, setValue] = useState(props.row['feeType'] || '');
        const [amount, setAmount] = useState(props.row['amount'] || '');
        const errors = props.row['errors'];

        const handleValueChange = useCallback(
          (val) => {
            setValue(val.target.value);
            replaceElement(
              companyInfo.apis,
              'id',
              props.row.id,
              'feeType',
              val.target.value
            );
          },
          [props]
        );
        const handleAmountValueChanged = useCallback(
          (event) => {
            setAmount(event.target.value);
            replaceElement(
              companyInfo.apis,
              'id',
              props.row.id,
              'amount',
              event.target.value
            );
          },
          [props]
        );
        return (
          <td
            className="emoney-table-td MuiTableCell-root"
            style={{ verticalAlign: 'top' }}>
            <EmoneySelect
              style={{ width: 200 }}
              onChange={handleValueChange}
              value={value}
              // adormentText={intl.formatMessage({
              //   id: 'fee',
              // }) + ' ' + intl.formatMessage({
              //   id: 'emoney.currency:',
              // })}
              menuItems={['EUR', 'USD', 'GBP']}
              className="mt-3 mb-2 w-100"
              required
              onValidated={(value) =>
                handleErrorChange('feeType', props.row.id, errors, value)
              }
              submitted={props.row['submitted']}
            />
            <AdormentTextField
              fullWidth
              placeholder={intl.formatMessage({
                id: 'required.field',
                defaultMessage: 'Rquired Field'
              })}
              adormentText={intl.formatMessage({
                id: 'emoney.amount:',
                defaultMessage: 'Amount:'
              })}
              type="number"
              value={amount}
              name="amount"
              onChange={handleAmountValueChanged}
              className="mt-3 mb-2 company-normal-textfield"
              required
              onValidated={(value) =>
                handleErrorChange('amount', props.row.id, errors, value)
              }
              submitted={props.row['submitted']}
            />
          </td>
        );
      }
    },
    {
      title: intl.formatMessage({
        id: 'emoney.action',
        defaultMessage: 'ACTION'
      }),
      name: 'action',
      width: '8px',
      shouldShow: false,
      HeaderCell: (column) => {
        return (
          <div
            style={{ textAlign: 'right', paddingRight: '15px', width: '100%' }}>
            <div>{column.column.title}</div>
          </div>
        );
      },
      Cell: (row, column) => {
        const apiAnchorRef = useRef(null);
        const apiContainerRef = useRef(null);
        const [apiOpen, setApiOpen] = useState(false);
        const handleToggle = useCallback((event) => {
          event.stopPropagation();
          setApiOpen(true);
        }, []);
        const handleApiClose = useCallback(
          (event) => {
            if (
              apiAnchorRef.current &&
              apiAnchorRef.current.contains(event.target)
            ) {
              return;
            }
            setApiOpen(false);
          },
          [apiAnchorRef]
        );
        const handleApiListKeyDown = useCallback((event) => {
          if (event.key === 'Tab') {
            event.preventDefault();
            setApiOpen(false);
          }
        }, []);
        const onClickHandler = useCallback((e) => {
          if (
            apiContainerRef &&
            apiContainerRef.current !== null &&
            apiContainerRef.current.contains(e.target)
          ) {
            return;
          }
          setApiOpen(false);
        }, []);

        //Effect
        useEffect(() => {
          document.addEventListener('mousedown', onClickHandler);
          return () => {
            document.removeEventListener('mousedown', onClickHandler);
          };
        }, [onClickHandler]);
        return (
          <div ref={apiContainerRef}>
            <Button
              ref={apiAnchorRef}
              aria-controls={apiOpen ? 'row-menu-list-grow' : undefined}
              aria-haspopup="true"
              onClick={handleToggle}
              className="d-flex flex-column">
              <span className="emicon-menue" />
            </Button>

            <Popper
              open={apiOpen}
              anchorEl={apiAnchorRef?.current}
              role={undefined}
              transition
              placement="bottom-end"
              style={{ zIndex: '10000' }}>
              {({ TransitionProps, placement }) => (
                <Grow
                  {...TransitionProps}
                  style={{ transformOrigin: 'bottom' }}>
                  <Paper>
                    <ClickAwayListener onClickAway={handleApiClose}>
                      <MenuList
                        autoFocusItem={apiOpen}
                        id="row-menu-list-grow"
                        onKeyDown={handleApiListKeyDown}>
                        <DropdownMenuItem
                          onClick={(event) =>
                            handleApiMenuItemClick(row, event, 'edit')
                          }
                          icon={'emicon-edit'}
                          text={intl.formatMessage({
                            id: 'emoney.edit',
                            defaultMessage: 'Edit User'
                          })}
                        />
                        <DropdownMenuItem
                          onClick={(event) =>
                            handleApiMenuItemClick(row, event, 'delete')
                          }
                          icon={'emicon-delete'}
                          text={intl.formatMessage({
                            id: 'emoney.delete',
                            defaultMessage: 'Active / Inactive'
                          })}
                        />
                      </MenuList>
                    </ClickAwayListener>
                  </Paper>
                </Grow>
              )}
            </Popper>
          </div>
        );
      },

      EditingCell: (props) => {
        /**
         * Action Editing Cell
         */
        const handleClick = useCallback(
          (event) => {
            if (props.row['canContinue']) {
              let updatedDatas = replaceElement(
                companyInfo.apis,
                'id',
                props.row.id,
                'submitted',
                true
              );
              updatedDatas = replaceElement(
                companyInfo.apis,
                'id',
                props.row.id,
                'isSaved',
                true
              );
              setCompanyInfo((companyInfo) => ({
                ...companyInfo,
                apis: updatedDatas
              }));
              handleAction(props.row.id, false);
            } else {
              let updatedDatas = replaceElement(
                companyInfo.apis,
                'id',
                props.row.id,
                'submitted',
                true
              );
              updatedDatas = replaceElement(
                companyInfo.apis,
                'id',
                props.row.id,
                'isSaved',
                true
              );
              setCompanyInfo((companyInfo) => ({
                ...companyInfo,
                apis: updatedDatas
              }));
            }

            // set submitted field to show validation errors in text field.
          },
          [props]
        );
        return (
          <td className="MuiTableCell-root" style={{ verticalAlign: 'top' }}>
            <Button
              className="emoney-table-save-button"
              onClick={() => handleClick(props.row.id, false)}>
              {intl.formatMessage({
                id: 'emoney.save',
                defaultMessage: 'SAVE'
              })}
            </Button>
          </td>
        );
      }
    }
  ];
};

// Company User Columns
export const CompanyUserColumns = (
  intl,
  editingUserRowDatas,
  companyInfo,
  setEditingUserRowIds,
  setEditingUserRowDatas,
  setCompanyInfo,
  handleUserMenuItemClick
) => {
  const handleAction = (rowId, isCancel = true) => {
    let index = getIndexInArray(editingUserRowDatas, 'id', rowId);
    if (index !== -1) {
      let rowData = editingUserRowDatas[index];
      setEditingUserRowIds((prev) =>
        [].concat(prev.slice(0, index), prev.slice(index + 1))
      );
      setEditingUserRowDatas((prev) =>
        [].concat(prev.slice(0, index), prev.slice(index + 1))
      );

      if (isCancel) {
        // action to cancel
        let listIndex = getIndexInArray(companyInfo?.users, 'id', rowId);
        let newDatas = [];
        if (rowData.isEditing) {
          newDatas = [rowData];
        }
        setCompanyInfo((companyInfo) => ({
          ...companyInfo,
          users: [].concat(
            companyInfo?.users.slice(0, listIndex),
            newDatas,
            companyInfo?.users.slice(listIndex + 1)
          )
        }));
      }
    } else {
      // action to save result
      const updatedDatas = replaceElement(
        companyInfo.users,
        'id',
        rowId,
        'isSaved',
        true
      );
      setCompanyInfo((companyInfo) => ({
        ...companyInfo,
        users: updatedDatas
      }));
    }
  };
  const handleErrorChange = (field, rowId, prevError, errorResult) => {
    const selectedRow = getDataInArray(companyInfo?.users, 'id', rowId);
    const errors = selectedRow['errors'] || {};
    errors[field] = errorResult;
    replaceElement(companyInfo?.users, 'id', rowId, 'errors', errors);
    replaceElement(companyInfo?.users, 'id', rowId, 'canContinue', checkErrorObjValidated(errors));
  };
  return [
    {
      title: '',
      name: '',
      width: '3px',
      shouldShow: false,
      EditingCell: (props) => {
        const handleClick = useCallback(() => {
          handleAction(props.row.id);
        }, [props]);
        return (
          <td className=" MuiTableCell-root m-0">
            <div onClick={handleClick} style={{ cursor: 'pointer'}}>
              <CloseIcon />
            </div>
          </td>
        );
      }
    },
    {
      title: intl.formatMessage({
        id: 'emoney.firstName.uppercase',
        defaultMessage: 'First Name'
      }),
      name: 'firstName',
      shouldShow: true,
      width: '15px',
      EditingCell: (props) => {
        const [value, setValue] = useState(props.row[props.column.name]);
        const errors = props.row['errors'];
        const handleValueChange = useCallback((event) => {
          setValue(event.target.value);
          replaceElement(
            companyInfo.users,
            'id',
            props.row.id,
            event.target.name,
            event.target.value
          );
        }, [props]);
        return (
          <td className="emoney-table-td MuiTableCell-root">
            <AdormentTextField
              value={value}
              fullWidth
              placeholder={intl.formatMessage({
                id: 'required.field',
                defaultMessage: 'Rquired Field'
              })}
              name="firstName"
              onChange={handleValueChange}
              required={true}
              onValidated={(value) =>
                handleErrorChange('firstName', props.row.id, errors, value)
              }
              submitted={props.row['submitted']}
            />
          </td>
        );
      }
    },
    {
      title: intl.formatMessage({
        id: 'emoney.lastName.uppercase',
        defaultMessage: 'Last Name'
      }),
      name: 'lastName',
      shouldShow: true,
      width: '15px',
      EditingCell: (props) => {
        const [value, setValue] = useState(props.row[props.column.name]);
        const errors = props.row['errors'];
        const handleValueChange = useCallback((event) => {
          setValue(event.target.value);
          replaceElement(
            companyInfo.users,
            'id',
            props.row.id,
            props.column.name,
            event.target.value
          );
        }, [props]);
        return (
          <td className="emoney-table-td MuiTableCell-root">
            <AdormentTextField
              value={value}
              fullWidth
              placeholder={intl.formatMessage({
                id: 'required.field',
                defaultMessage: 'Rquired Field'
              })}
              name="lastName"
              onChange={handleValueChange}
              required={true}
              onValidated={(value) =>
                handleErrorChange('lastName', props.row.id, errors, value)
              }
              submitted={props.row['submitted']}
            />
          </td>
        );
      }
    },
    {
      title: intl.formatMessage({
        id: 'emoney.email',
        defaultMessage: 'E-MAIL'
      }),
      name: 'email',
      shouldShow: true,
      width: '10px',
      EditingCell: (props) => {
        const [value, setValue] = useState(props.row[props.column.name]);
        const errors = props.row['errors'];
        const handleValueChange = useCallback((event) => {
          setValue(event.target.value);
          replaceElement(
            companyInfo.users,
            'id',
            props.row.id,
            props.column.name,
            event.target.value
          );
        }, [props]);
        return (
          <td className="emoney-table-td MuiTableCell-root">
            <AdormentTextField
              fullWidth
              placeholder={intl.formatMessage({
                id: 'required.field',
                defaultMessage: 'Rquired Field'
              })}
              value={value}
              onChange={handleValueChange}
              required={true}
              onValidated={(value) =>
                handleErrorChange('email', props.row.id, errors, value)
              }
              submitted={props.row['submitted']}
              validator={Email}
            />
          </td>
        );
      }
    },
    {
      title: intl.formatMessage({
        id: 'emoney.status',
        defaultMessage: 'STATUS'
      }),
      name: 'status',
      shouldShow: true,
      width: '10px',
      Cell: (row, column) => {
        return (
          <Fragment>
            { row.status === 1 ? intl.formatMessage({ id: 'admin.user.table.header.detail.active' }) : intl.formatMessage({ id: 'admin.user.table.header.detail.deactive' })}
          </Fragment>
        )
      },
      EditingCell: (props) => {
        const [value, setValue] = useState(
          props.row['status'] === 1 ? true : false
        );
        const handleValueChange = useCallback(
          (event) => {
            setValue(event.target.checked);
            replaceElement(
              companyInfo.users,
              'id',
              props.row.id,
              'status',
              event.target.checked ? 1 : 0
            );
          },
          [props]
        );
        return (
          <td className="emoney-table-td MuiTableCell-root">
            <EmoneySwitch onChange={handleValueChange} checked={value} />
          </td>
        );
      }
    },
    {
      title: '',
      name: 'details',
      width: '8px',
      HeaderCell: (column) => {
        return (
          <div style={{ textAlign: 'right', paddingRight: '15px' }}>
            <div>{column.column.title}</div>
          </div>
        )
      },
      Cell: (row, column) => {
        const userContainerRef = useRef(null);
        const userAnchorRef = useRef(null);
        const [userOpen, setUserOpen] = useState(false);
        const handleToggle = useCallback(
          (event) => {
            event.stopPropagation();
            setUserOpen(true);
          },
          []
        );
        const handleUserClose = useCallback(
          (event) => {
            if (
              userAnchorRef.current &&
              userAnchorRef.current.contains(event.target)
            ) {
              return;
            }
            setUserOpen(false);
          },
          [userAnchorRef]
        );
        const handleUserListKeyDown = useCallback((event) => {
          if (event.key === 'Tab') {
            event.preventDefault();
            setUserOpen(false);
          }
        }, []);
        const onClickHandler = useCallback((e) => {
          if (
            userContainerRef &&
            userContainerRef.current !== null &&
            userContainerRef.current.contains(e.target)
          ) {
            return;
          }
          setUserOpen(false);
        }, []);

        //Effect
        useEffect(() => {
          document.addEventListener('mousedown', onClickHandler);
          return () => {
            document.removeEventListener('mousedown', onClickHandler);
          };
        }, [onClickHandler]);
        return (
          <div ref={userContainerRef}>
            <Button
              ref={userAnchorRef}
              aria-controls={userOpen ? 'row-menu-list-grow' : undefined}
              aria-haspopup="true"
              onClick={handleToggle}
              className="d-flex flex-column">
              <span className="emicon-menue" />
            </Button>

            <Popper
              open={userOpen}
              anchorEl={userAnchorRef?.current}
              role={undefined}
              transition
              placement="bottom-end"

              style={{ zIndex: '10000' }}
            >
              {({ TransitionProps, placement }) => (
                <Grow
                  {...TransitionProps}
                  style={{ transformOrigin: 'bottom' }}>
                  <Paper>
                    <ClickAwayListener onClickAway={handleUserClose}>
                      <MenuList
                        autoFocusItem={userOpen}
                        id="row-user-menu-list-grow"
                        onKeyDown={handleUserListKeyDown}>
                        <DropdownMenuItem
                          onClick={(event) =>
                            handleUserMenuItemClick(row, event, 'edit')
                          }
                          icon={'emicon-edit'}
                          text={intl.formatMessage({
                            id: 'emoney.edit',
                            defaultMessage: 'Edit User'
                          })}
                        />
                        <DropdownMenuItem
                          onClick={(event) =>
                            handleUserMenuItemClick(row, event, 'delete')
                          }
                          icon={'emicon-delete'}
                          text={intl.formatMessage({
                            id: 'emoney.delete',
                            defaultMessage: 'Active / Inactive'
                          })}
                        />
                      </MenuList>
                    </ClickAwayListener>
                  </Paper>
                </Grow>
              )}
            </Popper>
          </div>

        );
      },
      EditingCell: (props) => {
        console.log('props before click =', props.row);
        const handleClick = useCallback(
          (event) => {
            if (props.row['canContinue']) {
              let updatedDatas = replaceElement(
                companyInfo.users,
                'id',
                props.row.id,
                'submitted',
                true
              );
              updatedDatas = replaceElement(
                companyInfo.users,
                'id',
                props.row.id,
                'isSaved',
                true
              );
              setCompanyInfo((companyInfo) => ({
                ...companyInfo,
                users: updatedDatas
              }));
              handleAction(props.row.id, false);
            } else {
              let updatedDatas = replaceElement(
                companyInfo.users,
                'id',
                props.row.id,
                'submitted',
                true
              );
              updatedDatas = replaceElement(
                companyInfo.users,
                'id',
                props.row.id,
                'isSaved',
                true
              );
              setCompanyInfo((companyInfo) => ({
                ...companyInfo,
                users: updatedDatas
              }));
            }


          },
          [props]
        );
        return (
          <td className=" MuiTableCell-root">
            <Button className="emoney-table-save-button" onClick={handleClick}>
              {intl.formatMessage({
                id: 'emoney.save',
                defaultMessage: 'SAVE'
              })}
            </Button>
          </td>
        );
      }
    }
  ];
};
