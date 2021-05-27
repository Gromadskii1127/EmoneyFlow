import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  useMemo
} from 'react';
import {
  Button
} from '@material-ui/core';
import { injectIntl } from 'react-intl';
import AddIcon from '@material-ui/icons/Add';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { FormattedMessage } from 'react-intl';
import _, { keys, every } from 'lodash';
import Skeleton from '@material-ui/lab/Skeleton';

// Redux Selector
import {
  getCompany,
  isLoading,
  getResponse
} from 'redux/selectors/AdminCompanySelector';
// Rdux Actions
import * as AdminCompanyActions from 'redux/actions/AdminCompanyActions';
import { addError } from 'redux/actions/ErrorActions';

// Project Component
import { LoadingButton, AdormentTextField, EmoneyTable, EmoneyDialog, EmoneyDrawer } from 'components';
import { withMemo } from 'components/HOC';

// Utils
import { getIndexInArray } from 'utils/array_utils';
import { Email, Iban, Bic } from 'components/AdormentTextField/validators';
// columns
import { CompanyAPIColumns, CompanyUserColumns } from './columns';
import { ENUMS } from 'constant';
const CompanyEditDrawer = ({
  dispatch,
  intl,
  companyid,
  open,
  onClosedDrawer,
  companyData,
  isLoading,
  actionResponse,
  ...props
}) => {

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [companyInfo, setCompanyInfo] = useState({ apis: [], users: [] });

  const [editingApiRowIds, setEditingApiRowIds] = useState([]);
  const [editingApiRowDatas, setEditingApiRowDatas] = useState([]);
  const [apiDeleteDialogOpen, setApiDeleteDialogOpen] = useState(false);
  const [apiDeleteLoading, setApiDeleteLoading] = useState(false);
  const [selectedAPIData, setSelectedAPIData] = useState({});

  const [editingUserRowIds, setEditingUserRowIds] = useState([]);
  const [editingUserRowDatas, setEditingUserRowDatas] = useState([]);
  const [userDeleteDialogOpen, setUserDeleteDialogOpen] = useState(false);
  const [userDeleteLoading, setUserDeleteLoading] = useState(false);
  const [selectedUSERData, setSelectedUSERData] = useState({});

  const handleApiDeleteDialog = useCallback((type, data) => {
    setApiDeleteLoading(false);
    setApiDeleteDialogOpen(false);
    if (type === ENUMS.DialogButtonType.YES.type) {
      let index = getIndexInArray(companyInfo?.apis, 'id', data.id);
      if (index !== -1) {
        let newDatas = [];
        setCompanyInfo((companyInfo) => ({
          ...companyInfo,
          apis: [].concat(
            companyInfo?.apis.slice(0, index),
            newDatas,
            companyInfo?.apis.slice(index + 1)
          )
        }));
      }
    }
  }, [companyInfo?.apis]);
  const handleUserDeleteDialog = useCallback((type, data) => {
    setUserDeleteLoading(false);
    setUserDeleteDialogOpen(false);
    if (type === ENUMS.DialogButtonType.YES.type) {
      let index = getIndexInArray(companyInfo?.users, 'id', data.id);
      if (index !== -1) {
        let newDatas = [];
        setCompanyInfo((companyInfo) => ({
          ...companyInfo,
          users: [].concat(
            companyInfo?.users.slice(0, index),
            newDatas,
            companyInfo?.users.slice(index + 1)
          )
        }));
      }
    }

  }, [companyInfo?.users]);
  const handleApiMenuItemClick = useCallback(
    (rowData, event, type) => {
      if (!_.isEmpty(rowData)) {
        console.log('row, event, type', rowData, type);
        if (type === 'edit') {
          console.log('edit=', type);
          let newObject = Object.assign({}, rowData);
          newObject['isEditing'] = true;
          newObject['isSaved'] = false;
          setEditingApiRowDatas((prev) =>
            [].concat([...prev], [Object.assign({}, newObject)])
          );
          setEditingApiRowIds((prev) =>
            [].concat(
              [...prev],
              [getIndexInArray(companyInfo.apis, 'id', rowData.id)]
            )
          );
        } else if (type === 'delete') {
          setApiDeleteLoading(false);
          setApiDeleteDialogOpen(true);
          setSelectedAPIData(rowData);

        }
      }
    },
    [companyInfo?.apis]
  );


  const handleUserMenuItemClick = useCallback(
    (rowData, event, type) => {
      if (!_.isEmpty(rowData)) {
        if (type === 'edit') {
          let newObject = Object.assign({}, rowData);
          newObject['isEditing'] = true;
          newObject['isSaved'] = false;
          setEditingUserRowDatas((prev) =>
            [].concat([...prev], [Object.assign({}, newObject)])
          );
          setEditingUserRowIds((prev) =>
            [].concat(
              [...prev],
              [getIndexInArray(companyInfo.users, 'id', rowData.id)]
            )
          );
        } else if (type === 'delete') {

          console.log('user delete');
          setUserDeleteLoading(false);
          setUserDeleteDialogOpen(true);
          setSelectedUSERData(rowData);
        }
      }
    },
    [companyInfo?.users]
  );

  const apiColumns = useMemo(
    () =>
      CompanyAPIColumns(
        intl,
        editingApiRowDatas,
        setEditingApiRowIds,
        setEditingApiRowDatas,
        companyInfo,
        setCompanyInfo,
        handleApiMenuItemClick,
      ),
    [editingApiRowDatas, handleApiMenuItemClick, intl, companyInfo]
  );
  const userColumns = useMemo(
    () =>
      CompanyUserColumns(
        intl,
        editingUserRowDatas,
        companyInfo,
        setEditingUserRowIds,
        setEditingUserRowDatas,
        setCompanyInfo,
        handleUserMenuItemClick
      ),
    [editingUserRowDatas, handleUserMenuItemClick, intl, companyInfo]
  );
  const toggleDrawer = useCallback(
    (open) => (event) => {
      if (
        event.type === 'keydown' &&
        (event.key === 'Tab' || event.key === 'Shift')
      ) {
        return;
      }
      setDrawerOpen(open);
    },
    []
  );

  const handleResetValues = useCallback((event) => {
    setSubmitted(false);
    setCompanyInfo({ apis: [], users: [] });
  }, []);

  const handleClose = useCallback(
    (value = false) => {
      if (!isLoading) {
        handleResetValues();
        toggleDrawer(false);
        onClosedDrawer(value);
      }

    },
    [onClosedDrawer, toggleDrawer, handleResetValues, isLoading]
  );

  const handleSelectRow = useCallback((row, event) => { }, []);
  const handleApiAddClick = useCallback(
    (event) => {
      let newObject = {};
      for (var i = 0; i < apiColumns.length; i++) {
        let column = apiColumns[i];
        if (column.shouldShow) {
          newObject[column.name] = '';
        }
      }
      const id = 'added-' + companyInfo.apis?.length + 1;
      newObject['id'] = id;
      newObject['date'] = new Date().toDateString();
      newObject['isEditing'] = false;
      newObject['isSaved'] = false;
      setCompanyInfo((companyInfo) => ({
        ...companyInfo,
        apis: [].concat([...companyInfo?.apis], [newObject])
      }));
      setEditingApiRowDatas((prev) =>
        [].concat([...prev], [Object.assign({}, newObject)])
      );
      setEditingApiRowIds((prev) =>
        [].concat([...prev], [companyInfo.apis.length])
      );
    },
    [apiColumns, companyInfo]
  );

  const handleUserAddClick = useCallback(
    (event) => {
      let newObject = {};
      for (var i = 0; i < userColumns.length; i++) {
        let column = userColumns[i];
        if (column.shouldShow) {
          newObject[column.name] = '';
        }
      }
      const id = 'added-' + companyInfo.users?.length + 1;
      newObject['id'] = id;
      newObject['date'] = new Date().toDateString();
      newObject['isEditing'] = false;
      newObject['isSaved'] = false;
      newObject['errors'] = {
        firstName: 'errors.required',
        lastName: 'errors.required',
        email: 'errors.required'
      }
      setCompanyInfo((companyInfo) => ({
        ...companyInfo,
        users: [].concat([...companyInfo.users], [newObject])
      }));
      setEditingUserRowDatas((prev) =>
        [].concat([...prev], [Object.assign({}, newObject)])
      );
      setEditingUserRowIds((prev) =>
        [].concat([...prev], [companyInfo.users.length])
      );
    },
    [companyInfo, userColumns]
  );



  const [loadingPromise, setLoadingPromise] = useState();
  useEffect(() => {
    console.log('company id = ', companyid);
    if (companyid > 0) {
      setDataLoaded(false);
      setLoadingPromise(dispatch(AdminCompanyActions.getCompany(companyid)).then(response => {       
        setDataLoaded(true);
      }));
    } else {
      setDataLoaded(true);
    }
  }, [companyid, dispatch, intl]);

  useEffect(() => {
    if (companyData && !_.isEmpty(companyData)) {
      setCompanyInfo(companyData);
      setDataLoaded(true);
    }
  }, [companyData]);

  useEffect(() => {
    handleResetValues();
    setDrawerOpen(open);
  }, [open, handleResetValues]);

  const [dataLoaded, setDataLoaded] = useState(false);

  const handleChangedInfo = useCallback(
    (event) => {
      setCompanyInfo(
        _.extend({}, companyInfo, {
          [event.target.name]: event.target.value
        })
      );
    },
    [companyInfo]
  );
  const validationErros = useRef({});

  const isValid = useCallback(() => {
    return (
      keys(validationErros.current).length === 8 &&
      every(validationErros.current, (v) => !v)
    );
  }, [validationErros]);

  const isValueValid = useRef(isValid(companyInfo));

  const onValidated = (field) => (validationError) => {
    validationErros.current[field] = validationError;

    if (isValueValid.current !== isValid()) {
      isValueValid.current = isValid();
    }
  };

  const [submitted, setSubmitted] = useState(false);

  const handleSaveClicked = useCallback(
    (event) => {
      setSubmitted(true);
      if (isValueValid.current) {
        if (companyInfo.hasOwnProperty('id')) {
          dispatch(AdminCompanyActions.updateCompany(companyInfo))
            .then((response) => {
              if (response?.payload?.status === 200) {
                handleClose(true);
              }
            })
            .catch((error) => {
              dispatch(addError({ type: 'error', message: intl.formatMessage({ id: "admin.company.drawer.save.error" }) }));
            });
        } else {
          dispatch(AdminCompanyActions.addCompany(companyInfo))
            .then((response) => {
              if (response?.payload?.status === 200) {
                handleClose(true);
              }
            })
            .catch((error) => {
              dispatch(addError({ type: 'error', message: intl.formatMessage({ id: "admin.company.drawer.save.error" }) }));
            });
        }

      }
    },
    [companyInfo, dispatch, handleClose, intl]
  );

  const [header, setHeader] = useState();
  useEffect(() => {
    setHeader(
      <LoadingButton
        aria-label="close"
        size="medium"
        className="company-drawer-save-button"
        disabled={isLoading}
        isLoading={isLoading}
        onClick={handleSaveClicked}>
        <FormattedMessage
          id="admin.user.drawer.save"
          defaultMessage="SAVE & LEAVE"
        />
      </LoadingButton>
    );
  }, [isLoading, handleSaveClicked]);

  return (
    <EmoneyDrawer
      anchor="bottom"
      isOpen={drawerOpen}
      onClose={handleClose}
      classes={{ paper: 'company-drawer-paper' }}
      header={header}>
      <div className="flex-grow-1 pr-5 pl-5 d-flex flex-column pt-3">
        <div className="d-flex flex-grow-1 flex-column w-75">
          {dataLoaded ? (
            <AdormentTextField
              fullWidth
              placeholder={intl.formatMessage({
                id: 'required.field',
                defaultMessage: 'Rquired Field'
              })}
              adormentText={intl.formatMessage({
                id: 'admin.user.drawer.company',
                defaultMessage: 'COMPANY:'
              })}
              value={companyInfo?.name || ''}
              required={true}
              submitted={submitted}
              onValidated={onValidated('name')}
              name="name"
              onChange={handleChangedInfo}
              className="mt-3 company-title-textfield"
            />
          ) : (
            <Skeleton key="name" style={{ height: 60 }} variant="text" />
          )}

          <div className="d-flex flex-row w-100 h-100">
            <div className="company-drawer-main-flex d-flex flex-column">
              {dataLoaded ? (
                <AdormentTextField
                  fullWidth
                  placeholder={intl.formatMessage({
                    id: 'required.field',
                    defaultMessage: 'Rquired Field'
                  })}
                  adormentText={intl.formatMessage({
                    id: 'emoney.firstName:',
                    defaultMessage: 'First Name:'
                  })}
                  value={companyInfo?.firstName || ''}
                  required={true}
                  submitted={submitted}
                  name="firstName"
                  onChange={handleChangedInfo}
                  className="mt-4 company-normal-textfield"
                />
              ) : (
                <Skeleton
                  key="firstName"
                  style={{ height: 40 }}
                  variant="text"
                />
              )}
              {dataLoaded ? (
                <AdormentTextField
                  fullWidth
                  placeholder={intl.formatMessage({
                    id: 'required.field',
                    defaultMessage: 'Rquired Field'
                  })}
                  adormentText={intl.formatMessage({
                    id: 'emoney.lastName:',
                    defaultMessage: 'Last Name:'
                  })}
                  value={companyInfo?.lastName || ''}
                  required={true}
                  submitted={submitted}
                  onValidated={onValidated('lastName')}
                  name="lastName"
                  onChange={handleChangedInfo}
                  className="mt-4 company-normal-textfield"
                />
              ) : (
                <Skeleton
                  key="lastName"
                  style={{ height: 40 }}
                  variant="text"
                />
              )}
              {dataLoaded ? (
                <AdormentTextField
                  fullWidth
                  placeholder={intl.formatMessage({
                    id: 'required.field',
                    defaultMessage: 'Rquired Field'
                  })}
                  adormentText={intl.formatMessage({
                    id: 'admin.user.drawer.email',
                    defaultMessage: 'E-Mail:'
                  })}
                  value={companyInfo?.email || ''}
                  required={true}
                  submitted={submitted}
                  onValidated={onValidated('email')}
                  name="email"
                  onChange={handleChangedInfo}
                  className="mt-4 company-normal-textfield"
                  validator={Email}
                />
              ) : (
                <Skeleton
                  key="email"
                  style={{ height: 40 }}
                  variant="text"
                />
              )}
            </div>
            <div className="company-drawer-main-spacer"></div>
            <div className="company-drawer-main-flex d-flex flex-column">
              {dataLoaded ? (
                <AdormentTextField
                  fullWidth
                  placeholder={intl.formatMessage({
                    id: 'required.field',
                    defaultMessage: 'Rquired Field'
                  })}
                  adormentText={intl.formatMessage({
                    id: 'admin.user.drawer.bankname',
                    defaultMessage: 'Bank Name:'
                  })}
                  value={companyInfo?.bank || ''}
                  required={true}
                  submitted={submitted}
                  onValidated={onValidated('bank')}
                  name="bank"
                  onChange={handleChangedInfo}
                  className="mt-4 company-normal-textfield"
                />
              ) : (
                <Skeleton
                  key="bank"
                  style={{ height: 40 }}
                  variant="text"
                />
              )}

              {dataLoaded ? (
                <AdormentTextField
                  fullWidth
                  placeholder={intl.formatMessage({
                    id: 'required.field',
                    defaultMessage: 'Rquired Field'
                  })}
                  adormentText={intl.formatMessage({
                    id: 'admin.user.drawer.iban',
                    defaultMessage: 'IBAN:'
                  })}
                  value={companyInfo?.iban || ''}
                  required={true}
                  submitted={submitted}
                  onValidated={onValidated('iban')}
                  name="iban"
                  onChange={handleChangedInfo}
                  className="mt-4 company-normal-textfield"
                  validator={Iban}
                />
              ) : (
                <Skeleton
                  key="iban"
                  style={{ height: 40 }}
                  variant="text"
                />
              )}
              {dataLoaded ? (
                <AdormentTextField
                  fullWidth
                  placeholder={intl.formatMessage({
                    id: 'required.field',
                    defaultMessage: 'Rquired Field'
                  })}
                  adormentText={intl.formatMessage({
                    id: 'admin.user.drawer.bic',
                    defaultMessage: 'BIC:'
                  })}
                  value={companyInfo?.bic || ''}
                  required={true}
                  submitted={submitted}
                  onValidated={onValidated('bic')}
                  name="bic"
                  onChange={handleChangedInfo}
                  className="mt-4 company-normal-textfield"
                  validator={Bic}
                />
              ) : (
                <Skeleton
                  key="bic"
                  style={{ height: 40 }}
                  variant="text"
                />
              )}
              {dataLoaded ? (
                <AdormentTextField
                  fullWidth
                  placeholder={intl.formatMessage({
                    id: 'required.field',
                    defaultMessage: 'Rquired Field'
                  })}
                  adormentText={intl.formatMessage({
                    id: 'admin.user.drawer.account.no',
                    defaultMessage: 'Account No.:'
                  })}
                  value={companyInfo?.accountNo || ''}
                  required={true}
                  submitted={submitted}
                  onValidated={onValidated('accountNo')}
                  name="accountNo"
                  onChange={handleChangedInfo}
                  className="mt-4 company-normal-textfield"
                />
              ) : (
                <Skeleton
                  key="accountNo"
                  style={{ height: 40 }}
                  variant="text"
                />
              )}
              {dataLoaded ? (
                <AdormentTextField
                  fullWidth
                  placeholder={intl.formatMessage({
                    id: 'required.field',
                    defaultMessage: 'Rquired Field'
                  })}
                  adormentText={intl.formatMessage({
                    id: 'admin.user.drawer.routing',
                    defaultMessage: 'Routing No.:'
                  })}
                  value={companyInfo?.routingNo || ''}
                  required={true}
                  submitted={submitted}
                  onValidated={onValidated('routingNo')}
                  name="routingNo"
                  onChange={handleChangedInfo}
                  className="mt-4 company-normal-textfield"
                />
              ) : (
                <Skeleton
                  key="routingNo"
                  style={{ height: 40 }}
                  variant="text"
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="comapny-drawer-subtable pr-5 pl-5">
        <div className="d-flex mb-2 flex-row justify-content-between">
          <div className="company-drawer-subtitle  d-flex align-items-center">
            {intl.formatMessage({
              id: 'admin.user.drawer.api.title',
              defaultMessage: 'API'
            })}
          </div>
          <div className="d-flex flex-row">
            <Button
              size="medium"
              className="company-add-button"
              onClick={handleApiAddClick}>
              {intl.formatMessage({ id: "emoney.add" })}
              <AddIcon fontSize="small" />
            </Button>
          </div>
        </div>
        <EmoneyTable
          data={companyInfo?.apis || []}
          columns={apiColumns}
          isGrouping={false}
          totalCount={100}
          isPagination={false}
          isSubHeader={false}
          isSelectable={true}
          onSelected={handleSelectRow}
          grouping={{
            field: 'id'
          }}
          isEditing={true}
          editingRowIds={editingApiRowIds}
          loadingPromise={loadingPromise}
        />

        <EmoneyDialog
          data={selectedAPIData}
          isLoading={apiDeleteLoading}
          open={apiDeleteDialogOpen}
          title={intl.formatMessage({ id: 'emoney.delete' })}
          content={intl.formatMessage({ id: 'admin.company.drawer.api.delete.dialog' })}
          actions={[ENUMS.DialogButtonType.YES, ENUMS.DialogButtonType.NO]}
          onClose={handleApiDeleteDialog}
        />
        <EmoneyDialog
          data={selectedUSERData}
          isLoading={userDeleteLoading}
          open={userDeleteDialogOpen}
          title={intl.formatMessage({ id: 'emoney.delete' })}
          content={intl.formatMessage({ id: 'admin.company.drawer.user.delete.dialog' })}
          actions={[ENUMS.DialogButtonType.YES, ENUMS.DialogButtonType.NO]}
          onClose={handleUserDeleteDialog}
        />
      </div>
      <div className="comapny-drawer-subtable pr-5 pl-5">
        <div className="d-flex mb-2 flex-row justify-content-between">
          <div className="company-drawer-subtitle d-flex align-items-center">
            {intl.formatMessage({
              id: 'admin.user.drawer.user.title',
              defaultMessage: 'User'
            })}
          </div>
          <div className="d-flex flex-row">
            <Button
              size="medium"
              className="company-add-button"
              onClick={handleUserAddClick}>
              {intl.formatMessage({ id: "emoney.add" })}
              <AddIcon fontSize="small" />
            </Button>
          </div>
        </div>
        <EmoneyTable
          data={companyInfo?.users || []}
          columns={userColumns}
          isGrouping={false}
          totalCount={100}
          isPagination={false}
          isSubHeader={false}
          isSelectable={true}
          onSelected={handleSelectRow}
          grouping={{
            field: 'id'
          }}
          isEditing={true}
          editingRowIds={editingUserRowIds}
          loadingPromise={loadingPromise}
        />
      </div>
    </EmoneyDrawer>
  );
};

const state = createStructuredSelector({
  companyData: getCompany,
  isLoading: isLoading,
  actionResponse: getResponse
});

export default connect(state)(injectIntl(withMemo(CompanyEditDrawer)));
