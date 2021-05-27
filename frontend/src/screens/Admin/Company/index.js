import React, {
  Fragment,
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo
} from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import _ from 'lodash';
import AddIcon from '@material-ui/icons/Add';
import {
  Button,
  useTheme
} from '@material-ui/core';
// Actions
import * as AdminCompanyActions from 'redux/actions/AdminCompanyActions'; // Redux
import { getCompanyList } from 'redux/selectors/AdminCompanySelector';
import { addError } from 'redux/actions/ErrorActions';

// Project Components
import { withMemo } from 'components/HOC';
import { EmoneyTable, PageFilterHeader, EmoneyDialog } from 'components';
import { CompanyEditDrawer } from './components';
// constant
import { statusValues, DEFAULT_PAGNATION_COUNT, ENUMS } from 'constant';
// columns
import { CompanyColumn } from './columns';


const Company = ({ dispatch, intl, listData, ...props }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const containerRef = useRef(null);
  const [selectedCompanyId, setSelectedCompanyId] = useState(0);
  const [sizePerPage, setSizePerPage] = useState(DEFAULT_PAGNATION_COUNT);
  const [currentPage, setCurrentPage] = useState(0);
  const [keyword, setKeyword] = useState('');

  const [selectedCompany, setSelectedCompany] = useState({});
  const [deleteDlgOpen, setDeleteDlgOpen] = useState(false);
  const [isDeleteDlgLoading, setIsDeleteDlgLoading] = useState(false);

  const [loadingPromise, setLoadungPromise] = useState();
  const theme = useTheme();


  const handleViewEdit = useCallback(
    (rowData) => {
      if (!_.isEmpty(rowData)) {
        setSelectedCompanyId(rowData.id);
        setDrawerOpen(true);
      }
    },
    []
  );

  const fetchCompanyList = useCallback(() => {
    setLoadungPromise(
      dispatch(
        AdminCompanyActions.getCompanyList(keyword, sizePerPage, currentPage)
      )
        .then((response) => {
        })
        .catch((error) => {
          dispatch(addError({ type: 0, message: intl.formatMessage({ id: 'admin.company.drawer.getcompanylist.error' }), from: 'Company' }));
        }));
  }, [dispatch, sizePerPage, currentPage, keyword, intl]);
  const handleOnCloseDeleteDlg = useCallback((type, rowData) => {
    if (type === ENUMS.DialogButtonType.YES.type) {
      setIsDeleteDlgLoading(true);
      dispatch(AdminCompanyActions.deleteCompany(rowData.id)).then(
        (response) => {
          setIsDeleteDlgLoading(false);
          setDeleteDlgOpen(false);
          fetchCompanyList();

        }
      ).catch(error => {
        dispatch(addError({ type: 0, message: intl.formatMessage({ id: 'admin.company.delete.error' }), from: 'Company' }));
      });
    } else {
      setDeleteDlgOpen(false);
    }

  }, [fetchCompanyList, dispatch, intl])
  const handleDelete = useCallback(
    (rowData) => {
      setSelectedCompany(rowData);
      setIsDeleteDlgLoading(false);
      setDeleteDlgOpen(true);

    },
    []
  );
  const handleSelectRow = useCallback((row, event) => { }, []);

  const handleRefreshTableHandler = useCallback(
    (page, sizePerPage) => {
      setSizePerPage(sizePerPage);
      setCurrentPage(page);
      fetchCompanyList();
    },
    [fetchCompanyList]
  );
  //drawer

  const onClickHandler = useCallback((e) => {
    if (
      containerRef &&
      containerRef.current != null &&
      containerRef.current.contains(e.target)
    ) {
      return;
    }
  }, []);

  const onClosedDrawer = useCallback(
    (state) => {
      if (state === true) {
        fetchCompanyList();
      }
      setSelectedCompanyId(0);
      setDrawerOpen(false);
    },
    [fetchCompanyList]
  );

  const handleAddClick = useCallback((event) => {
    setSelectedCompanyId(0);
    setDrawerOpen(true);
  }, []);

  const columns = useMemo(
    () =>
      CompanyColumn(
        intl,
        statusValues,
        handleViewEdit,
        handleDelete,

        theme
      ),
    [intl, handleViewEdit, handleDelete, theme]
  );

  //handler

  //Effect
  useEffect(() => {
    document.addEventListener('mousedown', onClickHandler);
    return () => {
      document.removeEventListener('mousedown', onClickHandler);
    };
  }, [onClickHandler]);

  useEffect(() => {
    fetchCompanyList();
  }, [fetchCompanyList]);

  return (
    <Fragment>
      <PageFilterHeader
        pageTitleId="admin.company.title"
        onSearchTextChange={(keyword) => {
          setKeyword(keyword);
        }}
        customButton={
          <Button
            size="medium"
            className="company-add-button"
            onClick={handleAddClick}>
            Add
            <AddIcon fontSize="small" />
          </Button>
        }
      />

      <EmoneyTable
        data={listData.list || []}
        columns={columns}
        isGrouping={false}
        totalCount={listData.totalCount}
        isPagination={true}
        isSubHeader={false}
        onSelected={handleSelectRow}
        onRefreshPage={handleRefreshTableHandler}
        grouping={{
          field: 'date'
        }}
        currentPage={currentPage}
        sizePerPage={sizePerPage}
        loadingPromise={loadingPromise}
      />

      <CompanyEditDrawer
        open={drawerOpen}
        onClosedDrawer={onClosedDrawer}
        companyid={selectedCompanyId}
      />
      <EmoneyDialog
        data={selectedCompany}
        isLoading={isDeleteDlgLoading}
        open={deleteDlgOpen}
        title={intl.formatMessage({ id: 'emoney.delete' })}
        content={intl.formatMessage({ id: 'admin.company.company.delete.dialog' })}
        actions={[ENUMS.DialogButtonType.YES, ENUMS.DialogButtonType.NO]}
        onClose={handleOnCloseDeleteDlg}
      />
    </Fragment>
  );
};

const state = createStructuredSelector({
  listData: getCompanyList
});

export default connect(state)(injectIntl(withMemo(Company)));
