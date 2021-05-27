import React, {
  Fragment,
  useEffect,
  useState,
  useCallback,
  useMemo
} from 'react';
import _ from 'lodash';
import { AdormentTextField, PageFilterHeader, MorePopper } from 'components';
import { ToolTipIconButton } from 'components/EmoneyButtons';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
// Components
import {
  Button,
  MenuList,
} from '@material-ui/core';

// Icons
import CloseIcon from '@material-ui/icons/Close';

import { Table } from '@devexpress/dx-react-grid-material-ui';
// Actions
import * as AdminUserActions from 'redux/actions/AdminUserActions';
// Selectors
import { getUserList, getUser } from 'redux/selectors/AdminUserSelector';
// Project Components
import { withMemo } from 'components/HOC';
import { DropdownMenuItem } from 'components/EmoneyMenu/components';
import { EmoneyTable, EmoneySwitch, LoadingButton } from 'components';
import { ResetDialog, DeactiveOtpDialog, DeleteDialog, CompanyAutoComplete } from './components';
import { DEFAULT_PAGNATION_COUNT } from 'constant'
import { Email } from 'components/AdormentTextField/validators';
import { checkErrorObjValidated } from 'utils/array_utils';
import { CompanyEditDrawer } from '../Company/components'
const {
  replaceElement,
  getDataInArray,
  getIndexInArray
} = require('utils/array_utils');
const User = ({ dispatch, intl, listData, companyList, ...props }) => {
  const [list, setList] = useState(listData.list);
  const [editingRowIds, setEditingRowIds] = useState([]);
  const [editingRowDatas, setEditingRowDatas] = useState([]);
  const [cmpDrawerOpen, setCmpDrawerOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState({});
  const [addedNewCompany, setAddedNewCompany] = useState(false);
  //popper
  const [keyword, setKeyword] = useState('');
  const [resetOpen, setResetOpen] = useState(false);
  const [dOtpOpen, setDOtpOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [sizePerPage, setSizePerPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  const [loadingPromise, setLoadungPromise] = useState();

  const fetchUserList = useCallback(() => {
    setLoadungPromise(
      dispatch(AdminUserActions.getUserList(keyword, sizePerPage, currentPage)));
  }, [dispatch, keyword, sizePerPage, currentPage])
  const handleResetClose = useCallback((value) => {
    setResetOpen(false);
  }, []);
  const handleDOtpClose = useCallback((value) => {
    setDOtpOpen(false);
  }, []);
  const handleDeleteClose = useCallback((value) => {
    if (value) {
      fetchUserList();
    }
    setDeleteOpen(false);
  }, [fetchUserList]);
  // handler
  const onClosedDrawer = useCallback(
    (state) => {
      if (state === true) {
        setAddedNewCompany(true);
      }
      setCmpDrawerOpen(false);
    },
    []
  );
  const handleMenuItemClick = useCallback(
    (rowData, event, type) => {
      if (!_.isEmpty(rowData)) {
        setSelectedRow(rowData)
        if (type === 'edit') {
          let newObject = Object.assign({}, rowData);
          newObject['isEditing'] = true;
          setEditingRowIds((prev) =>
            [].concat([...prev], [getIndexInArray(list, 'id', rowData.id)])
          );
          setEditingRowDatas((prev) => [].concat([...prev], [newObject]));
        } else if (type === 'active') {
          if (rowData.status === 1) {
            rowData.status = 0
          } else {
            rowData.status = 1
          }
          console.log('row data id = ', rowData.id);
          if (rowData.id.startsWidth("added-")) {
            dispatch(AdminUserActions.addUser(rowData.id, rowData))
          } else {
            dispatch(AdminUserActions.editUser(rowData.id, rowData))
          }

        } else if (type === 'resetpwd') {
          setResetOpen(true);
        } else if (type === 'otp') {
          setDOtpOpen(true);
        } else if (type === 'delete') {
          setDeleteOpen(true);
        }
      }
    },
    [list, dispatch]
  );

  const handleSelectRow = useCallback((row, event) => { }, []);

  // Effect
  useEffect(() => {
    fetchUserList();    
  }, [fetchUserList]);

  const handleRefreshTableHandler = useCallback((page, sizePerPage) => {
    setSizePerPage(sizePerPage);
    setCurrentPage(page);
    fetchUserList();
  }, [fetchUserList]);

  const handleErrorChange = useCallback((field, rowId, prevError, errorResult) => {
    prevError = prevError || {};
    prevError[field] = errorResult;
    const selectedRow = Object.assign({}, getDataInArray(list, 'id', rowId));
    const errors = selectedRow['errors'] || {};
    errors[field] = errorResult;
    replaceElement(list, 'id', rowId, 'errors', errors);
    replaceElement(list, 'id', rowId, 'canContinue', checkErrorObjValidated(errors));
  }, [list]);   

  const handleOnAddCompany = useCallback(() => {
    setAddedNewCompany(false);
    setCmpDrawerOpen(true);
  }, []);
  const columns = useMemo(
    () => [
      {
        title: '',
        name: 'icon',
        width: '80px',
        shouldShow: false,
        EditingCell: (props) => {
          const handleClick = useCallback(
            (event) => {
              let index = getIndexInArray(list, 'id', props.row.id);
              if (index !== -1) {
                let rowData = Object.assign({}, list[index]);
                let listIndex = getIndexInArray(list, 'id', props.row.id);
                let newDatas = [];
                var newEditingRowIds = [];
                var newEditingRowDatas = [];
                if (typeof rowData.id === 'string' && rowData.id.startsWith("added-")) {
                  for (var i = 0; i < editingRowIds.length; i++) {
                    if (editingRowIds[i] < index) {
                      newEditingRowIds.push(editingRowIds[i]);
                      newEditingRowDatas.push(editingRowDatas[i]);
                    } else if (editingRowIds[i] > index) {
                      newEditingRowIds.push(editingRowIds[i] - 1)
                      newEditingRowDatas.push(editingRowDatas[i]);
                    }
                  }
                } else {
                  newDatas = [];
                  for (i = 0; i < editingRowIds.length; i++) {
                    if (editingRowIds[i] !== index) {
                      newEditingRowIds.push(editingRowIds[i])
                      newEditingRowDatas.push(editingRowDatas[i]);
                    } else {
                      newDatas.push(editingRowDatas[i]);
                    }
                  }
                }
                setEditingRowIds(newEditingRowIds);
                setEditingRowDatas(newEditingRowDatas);
                setList((prev) =>
                  [].concat(
                    prev.slice(0, listIndex),
                    newDatas,
                    prev.slice(listIndex + 1)
                  )
                );
              }
            },
            [props]
          );
          return (
            <Table.Cell>
              <ToolTipIconButton
                icon={<CloseIcon />}
                onClick={handleClick}
                title={intl.formatMessage({
                  id: 'close'
                })}></ToolTipIconButton>
            </Table.Cell>
          );
        },
        Cell: (row, column, value) => {
          return (
            <div className="d-flex flex-row align-items-center ">
              <div className="header-user-image d-flex justify-content-center align-items-center normal-font-size font-light" style={{ textTransform: 'uppercase' }}>
                {row['firstName'].charAt(0)}{row['lastName'].charAt(0)}
              </div>
            </div>
          );
        },
        HeaderCell: ((column) => {
          return (
            <div>
            </div>
          )
        }),
      },
      {
        title: intl.formatMessage({
          id: 'emoney.firstName.uppercase',
          defaultMessage: 'First Name'
        }),
        name: 'firstName',
        width: '25%',
        shouldShow: true,
        EditingCell: (props) => {
          const [value, setValue] = useState(props.row[props.column.name]);
          const errors = props.row['errors'];
          const handleValueChange = useCallback(
            (event) => {
              setValue(event.target.value);
              replaceElement(
                list,
                'id',
                props.row.id,
                props.column.name,
                event.target.value
              );
            },
            [props]
          );
          return (
            <td className="emoney-table-td MuiTableCell-root">
              <AdormentTextField
                placeholder={intl.formatMessage({
                  id: 'emoney.firstName'
                })}
                fullWidth
                value={value}
                onChange={handleValueChange}
                required
                onValidated={(value) =>
                  handleErrorChange('firstName', props.row.id, errors, value)
                }
                submitted={props.row['submitted']}
              />
            </td>
          );
        },
        Cell: (row, column, value) => {
          return (
            <div className="d-flex flex-row align-items-center ">
              <div className="d-flex flex-row">
                <div>{row['firstName']}</div>
              </div>
            </div>
          );
        }
      },
      {
        title: intl.formatMessage({
          id: 'emoney.lastName.uppercase',
          defaultMessage: 'Last Name'
        }),
        name: 'lastName',
        width: '25%',
        shouldShow: true,
        EditingCell: (props) => {
          const [value, setValue] = useState(props.row[props.column.name]);
          const errors = props.row['errors'];
          const handleValueChange = useCallback(
            (event) => {
              setValue(event.target.value);
              replaceElement(
                list,
                'id',
                props.row.id,
                props.column.name,
                event.target.value
              );

            },
            [props]
          );
          return (
            <td className="emoney-table-td MuiTableCell-root">
              <AdormentTextField
                placeholder={intl.formatMessage({
                  id: 'emoney.lastName'
                })}
                value={value}
                onChange={handleValueChange}
                required
                onValidated={(value) =>
                  handleErrorChange('lastName', props.row.id, errors, value)
                }
                submitted={props.row['submitted']}
              />
            </td>
          );
        },
      },
      {
        title: intl.formatMessage({
          id: 'emoney.eMail',
          defaultMessage: 'E-MAIL'
        }),
        name: 'email',
        width: '25%',
        shouldShow: true,
        EditingCell: (props) => {
          const errors = props.row['errors'];

          const [value, setValue] = useState(props.row[props.column.name]);
          const handleValueChange = useCallback(
            (event) => {
              setValue(event.target.value);
              replaceElement(
                list,
                'id',
                props.row.id,
                props.column.name,
                event.target.value
              );

            },
            [props]
          );
          return (
            <td className="emoney-table-td MuiTableCell-root">
              <AdormentTextField
                placeholder={intl.formatMessage({
                  id: 'emoney.eMail'
                })}
                value={value}
                onChange={handleValueChange}
                required
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
          id: 'admin.user.table.header.company',
          defaultMessage: 'COMPANY'
        }),
        name: 'company',
        width: '25%',
        shouldShow: true,
        EditingCell: (props) => {

          const handleValueChange = useCallback(
            (val) => {
              const updatedDatas = replaceElement(
                list,
                'id',
                props.row.id,
                props.column.name,
                val
              );
              if (val?.id) {
                replaceElement(
                  updatedDatas,
                  'id',
                  props.row.id,
                  'companyId',
                  val.id
                );

              } else {

              }

            },
            [props]
          );

          return (
            <td className="emoney-table-td MuiTableCell-root">
              <CompanyAutoComplete key={props.row.id} value={props.row.company} onChange={handleValueChange} onAddCompany={handleOnAddCompany} onNewAdded={addedNewCompany} />
            </td>
          );
        },
        Cell: (row, column, value) => {
          return (
            <div className="d-flex flex-row align-items-center ">
              <div className="">
                {(row?.company) ? row?.company?.name : ''}
              </div>
            </div>
          );
        }

      },
      {
        title: intl.formatMessage({
          id: 'admin.user.table.header.detail.status',
          defaultMessage: 'STATUS'
        }),
        name: 'status',
        width: '70px',
        shouldShow: true,

        EditingCell: (props) => {
          const [value, setValue] = useState(
            props.row[props.column.name] === 1 ? true : false
          );
          const handleValueChange = useCallback(
            (event) => {
              setValue(event.target.checked);
              replaceElement(
                list,
                'id',
                props.row.id,
                props.column.name,
                event.target.checked ? 1 : 0
              );
            },
            [props]
          );
          return (
            <Table.Cell>
              <EmoneySwitch onChange={handleValueChange} checked={value} />
            </Table.Cell>
          );
        },
        Cell: (row, column, value) => {
          return <div>{row['status'] === 1 ? 'Active' : 'Inactive'}</div>;
        }
      },
      {
        title: '',
        name: 'action',
        width: '105px',
        shouldShow: false,
        HeaderCell: (column) => {
          return <div></div>;
        },
        Cell: (row, column) => {
          const [open, setOpen] = useState(false);
          return (
            <MorePopper onOpen={setOpen}>
              <MenuList
                autoFocusItem={open}
                id="row-menu-list-grow">
                <DropdownMenuItem
                  onClick={(event) => handleMenuItemClick(row, event, 'edit')}
                  icon={'emicon-edit'}
                  text={intl.formatMessage({
                    id: 'admin.user.table.header.detail.edit',
                    defaultMessage: 'Edit User'
                  })}
                />
                <DropdownMenuItem
                  onClick={(event) => handleMenuItemClick(row, event, 'active')}
                  icon={'emicon-user-lock'}
                  text={intl.formatMessage({
                    id: row.status !== 1 ? 'admin.user.table.header.detail.active' : 'admin.user.table.header.detail.deactive',
                    defaultMessage: 'Active / Inactive'
                  })}
                />
                <DropdownMenuItem
                  onClick={(event) =>
                    handleMenuItemClick(row, event, 'resetpwd')
                  }
                  icon={'emicon-rest-password'}
                  text={intl.formatMessage({
                    id: 'admin.user.table.header.detail.resetpwd',
                    defaultMessage: 'Reset Password'
                  })}
                />
                <DropdownMenuItem
                  onClick={(event) => handleMenuItemClick(row, event, 'delete')}
                  icon={'emicon-delete'}
                  text={intl.formatMessage({
                    id: 'admin.user.table.header.detail.delete',
                    defaultMessage: 'Delete'
                  })}
                />
              </MenuList>
            </MorePopper>
          );
        },
        EditingCell: (props) => {
          const handleClick = useCallback(
            (event) => {
              if (props.row['canContinue']) {
                let updatedDatas = replaceElement(
                  list,
                  'id',
                  props.row.id,
                  'isSaved',
                  true
                );
                updatedDatas = replaceElement(
                  list,
                  'id',
                  props.row.id,
                  'isSaving',
                  true
                );
                setList([].concat(updatedDatas));
                let index = getIndexInArray(list, 'id', props.row.id);
                if (index !== -1) {
                  let newData = Object.assign({}, getDataInArray(list, 'id', props.row.id));
                  console.log('row data id 1= ', props.row.id, newData);
                  if (typeof props.row.id === 'string' && props.row.id.startsWith("added-")) {
                    dispatch(AdminUserActions.addUser(props.row.id, newData)).then(response => {
                      if (response.payload?.status === 200) {
                        let newIndex = getIndexInArray(list, 'id', response.payload?.data.original);
                        var newUser = response?.payload.data.user;
                        var newEditingRowIds = [];
                        var newEditingRowDatas = [];
                        for (var i = 0; i < editingRowIds.length; i++) {
                          if (editingRowIds[i] === index)
                            continue;
                          newEditingRowIds.push(editingRowIds[i])
                          newEditingRowDatas.push(editingRowDatas[i]);
                        }
                        setEditingRowIds(newEditingRowIds);
                        setEditingRowDatas(newEditingRowDatas);
                        setList([].concat(list.slice(0, newIndex), [newUser], list.slice(newIndex + 1)));
                      } else {
                        let updatedDatas = replaceElement(
                          list,
                          'id',
                          props.row.id,
                          'isSaving',
                          false
                        );
                        setList(updatedDatas);
                      }
                    })
                  } else {
                    dispatch(AdminUserActions.editUser(props.row.id, newData)).then(response => {
                      if (response.payload?.status === 200) {
                        var newUser = response?.payload.data.user;
                        let newIndex = getIndexInArray(list, 'id', parseInt(response.payload?.data.original));
                        var newEditingRowIds = [];
                        var newEditingRowDatas = [];
                        for (var i = 0; i < editingRowIds.length; i++) {
                          if (editingRowIds[i] === index)
                            continue;
                          newEditingRowIds.push(editingRowIds[i])
                          newEditingRowDatas.push(editingRowDatas[i]);
                        }
                        setEditingRowIds(newEditingRowIds);
                        setEditingRowDatas(newEditingRowDatas);
                        setList([].concat(list.slice(0, newIndex), [newUser], list.slice(newIndex + 1)));

                      } else {
                        let updatedDatas = replaceElement(
                          list,
                          'id',
                          props.row.id,
                          'isSaving',
                          false
                        );
                        setList(updatedDatas);
                      }
                    })
                  }

                }
              } else {
                let updatedDatas = replaceElement(
                  list,
                  'id',
                  props.row.id,
                  'submitted',
                  true
                );

                setList([].concat(updatedDatas));
              }

            },
            [props]
          );
          return (
            <td className=" MuiTableCell-root">
              <LoadingButton
                size="small"
                disabled={props.row.isSaving || false}
                isLoading={props.row.isSaving || false}
                onClick={handleClick}>{intl.formatMessage({ id: "emoney.save", defaultMessage: "SAVE" })}
              </LoadingButton>
            </td>
          );
        }
      }
    ],
    [dispatch, intl, list, handleErrorChange, handleMenuItemClick, editingRowIds, editingRowDatas, handleOnAddCompany, addedNewCompany]
  );
  useEffect(() => {
    setList(listData.list)    
  }, [listData])
  useEffect(() => {
    console.log('list = ', list);
  }, [list])
  const handleAddClickUser = useCallback(
    (event) => {
      let newObject = {};
      for (var i = 0; i < columns.length; i++) {
        let column = columns[i];
        if (column.shouldShow) {
          newObject[column.name] = '';
        }
      }

      const id = 'added-' + list.length + 1;
      newObject['id'] = id;
      newObject['company'] = null;
      newObject['companyId'] = 0;
      newObject['date'] = new Date().toDateString();
      newObject['isEditing'] = false;
      newObject['status'] = 1;

      var newList = [].concat([newObject], list);
      setList(newList);
      var newEditingRowIds = editingRowIds.map((id, index) => {
        return id + 1;
      });
      newEditingRowIds.push(0);
      setEditingRowIds(newEditingRowIds);
      setEditingRowDatas((prev) =>
        [].concat([...prev], [Object.assign({}, newObject)])
      );


    },
    [columns, list, editingRowIds]
  );

  return (
    <Fragment>
      <PageFilterHeader
        pageTitleId="admin.user.title"
        onSearchTextChange={(searchText) => {
          setKeyword(searchText);
        }}
        customButton={
          <Button
            size="medium"
            className="company-add-button"
            onClick={handleAddClickUser}>
            {intl.formatMessage({ id: 'add-payee.link' })}

          </Button>
        }
      />
      <EmoneyTable
        data={list}
        columns={columns}
        isGrouping={false}
        totalCount={DEFAULT_PAGNATION_COUNT}
        //isPagination={true}
        isSubHeader={false}
        isSelectable={true}
        onSelected={handleSelectRow}
        onRefreshPage={handleRefreshTableHandler}
        currentPage={currentPage}
        sizePerPage={DEFAULT_PAGNATION_COUNT}
        grouping={{
          field: 'date'
        }}
        isEditing={true}
        editingRowIds={editingRowIds}
        className="admin-user-table"
        loadingPromise={loadingPromise}
      />

      <ResetDialog
        rowData={selectedRow}
        selectedValue={1}
        open={resetOpen}
        onClose={handleResetClose}
      />
      <DeactiveOtpDialog
        rowData={selectedRow}
        selectedValue={1}
        open={dOtpOpen}
        onClose={handleDOtpClose}
      />
      <DeleteDialog
        rowData={selectedRow}
        selectedValue={1}
        open={deleteOpen}
        onClose={handleDeleteClose}
      />
      <CompanyEditDrawer
        open={cmpDrawerOpen}
        onClosedDrawer={onClosedDrawer}
        companyid={0}
      />
    </Fragment>
  );
};

const state = createStructuredSelector({
  listData: getUserList,
  data: getUser,
});

export default connect(state)(injectIntl(withMemo(User)));
