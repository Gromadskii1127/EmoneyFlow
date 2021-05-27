import { useState, useEffect, Fragment, useRef, useCallback } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Box, Grid, Button } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';

import { injectIntl } from 'react-intl';

// Project Components
import { AdormentTextField, EmoneyTable, EmoneyDialog } from 'components';
import { withMemo } from 'components/HOC';
import { TitleTypography } from '../../components/helper';
import { getPayeeList } from 'redux/selectors/PayeeSelector';
import { DEFAULT_PAGNATION_COUNT } from 'constant';
import { fetchPayeeList, deletePayee as deletePayeeAction } from 'redux/actions/PayeeActions';
import PayeeColumns from './columns';
import PayeeDetailsDrawer from './components/PayeeDetailsDrawer';
import { debounce } from 'lodash';
import { ENUMS } from 'constant';

const PayeeOverview = ({ payeeList, dispatch, intl, ...props }) => {
  const [search, setSearch] = useState('');
  const [sizePerPage, setSizePerPage] = useState(DEFAULT_PAGNATION_COUNT);
  const [currentPage, setCurrentPage] = useState(0);
  const [loadingPromise, setLoadungPromise] = useState();
  const [detailOpen, setDetailsOpen] = useState(false);
  const [selectedPayeeId, setSelectedPayeeId] = useState(0);

  const [selectedPayee, setSelectedPayee] = useState({});
  const [deleteDlgOpen, setDeleteDlgOpen] = useState(false);
  const [isDeleteDlgLoading, setIsDeleteDlgLoading] = useState(false);

  const handleRefreshTableHandler = useCallback((page, sizePerPage) => {
    setSizePerPage(sizePerPage);
    setCurrentPage(page);
  }, []);

  const searchPayee = useRef(
    debounce((value) => {
      fetchPayeeListApi();
    }, 500)
  ).current;

  const searchChange = useCallback(({ target: { value } }) => {
    setSearch(value);
    searchPayee(value);
  }, [searchPayee]);

  const fetchPayee = useCallback((payee) => {
    setSelectedPayeeId(payee.id);
    setDetailsOpen(true);
  }, []);

  const deletePayee = useCallback((payee) => {
    setSelectedPayee(payee);
    setIsDeleteDlgLoading(false);
    setDeleteDlgOpen(true);
  }, []);

  const handleOnCloseDeleteDlg = useCallback((type, rowData) => {
    if (type === ENUMS.DialogButtonType.YES.type) {
      setIsDeleteDlgLoading(true);
      dispatch(deletePayeeAction(rowData)).then(
        (response) => {          
          if (response?.payload?.status === 200) {            
            setIsDeleteDlgLoading(false);
            setDeleteDlgOpen(false);
            setLoadungPromise(
              dispatch(
                fetchPayeeList(search, sizePerPage, currentPage)
              )
            );
          }
          
        }
      );
    } else {
      setDeleteDlgOpen(false);
    }

  }, [dispatch, sizePerPage, currentPage, search])


  const fetchPayeeListApi = useCallback(() => {
    setLoadungPromise(
      dispatch(
        fetchPayeeList(search, sizePerPage, currentPage)
      )
    );
  }, [dispatch, sizePerPage, currentPage, search])

  const handleDrawerClose = useCallback((reDraw) => {
    setDetailsOpen(false);
    setSelectedPayeeId(0);
    if (reDraw) {
      fetchPayeeListApi();
    }
  }, [fetchPayeeListApi]);

  useEffect(() => {
    fetchPayeeListApi();
  }, [fetchPayeeListApi]);
  return (
    <Fragment>
      <Box>
        <Box p={2}>
          <Grid container direction="row" alignItems="center">
            <Grid item xs>
              <TitleTypography>
                {intl.formatMessage({ id: 'payee' })}
              </TitleTypography>
            </Grid>

            <Grid item>
              <AdormentTextField
                value={search}
                onChange={searchChange}
                placeholder={intl.formatMessage({ id: 'search' })}
                adormentText={<SearchIcon />}></AdormentTextField>

              <Button
                size="medium"
                className="company-add-button"
                style={{ marginLeft: '10px' }}
                href="/user/add-payee"
                color="primary">
                {intl.formatMessage({ id: 'add-payee.link' })}
              </Button>
            </Grid>
          </Grid>
        </Box>

        <Box>
          <EmoneyTable
            data={payeeList.list || []}
            columns={PayeeColumns(intl, fetchPayee, deletePayee)}
            isSelectable={true}
            onRefreshPage={handleRefreshTableHandler}
            currentPage={currentPage}
            sizePerPage={sizePerPage}
            isPagination={true}
            loadingPromise={loadingPromise}
          />
        </Box>
      </Box>
      <EmoneyDialog
        data={selectedPayee}
        isLoading={isDeleteDlgLoading}
        open={deleteDlgOpen}
        title={intl.formatMessage({ id: 'emoney.delete' })}
        content={intl.formatMessage({ id: 'user.payee.overview.delete.content' })}
        actions={[ENUMS.DialogButtonType.YES, ENUMS.DialogButtonType.NO]}
        onClose={handleOnCloseDeleteDlg}
      />
      <PayeeDetailsDrawer open={detailOpen} payeeId={selectedPayeeId} onClose={handleDrawerClose} />
    </Fragment>
  );
};

const state = createStructuredSelector({
  payeeList: getPayeeList
});
export default connect(state)(injectIntl(withMemo(PayeeOverview)));
