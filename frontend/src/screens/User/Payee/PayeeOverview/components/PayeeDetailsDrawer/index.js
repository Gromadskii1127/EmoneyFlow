import { useState, useRef, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { injectIntl } from 'react-intl';

import {
  EmoneyDrawer,
  EmoneyDrawerSection,
  TransactionListTable,
  TransactionDetailDrawer,
  LoadingButton
} from 'components';
import { withMemo } from 'components/HOC';
import { unsetPayeeDetails, savePayee, fetchPayeeDetails } from 'redux/actions/PayeeActions';
import { getTransactionList } from 'redux/actions/UserTransactionActions';
import { getPayeeDetails } from 'redux/selectors/PayeeSelector';
import { getTransactionList as getTransactionListSelector } from 'redux/selectors/UserTransactionSelector';
import PayeeForm from '../../../../components/PayeeForm';
import { TitleTypography } from 'screens/User/components/helper';
import { transactionListColumn } from '../../../../Transaction/columns';
import { convertMethodRValue } from '../../../../../../constant';

const PayeeDetailsDrawer = ({ open, payeeId, payee, transactionList, dispatch, onClose, intl, ...props }) => {
  const [drawerOpen, setDrawerOpen] = useState(open);
  const [value, setValue] = useState(payee);
  const [payeeValue, setPayeeValue] = useState({});

  const [countPerPage, setCountPerPage] = useState(10);
  const [pageIndex, setPageIndex] = useState(0);
  const [convertedListData, setConvertedListData] = useState({
    totalCount: 0,
    list: []
  });
  const [canSave, setCanSave] = useState(false);
  let [isInitialValue, setIsInitialValue] = useState(true);
  const [savePromise, setSavePromise] = useState();
  const [loadingPromise, setLoadungPromise] = useState();
  const [selectedTransaction, setSelectedTransaction] = useState();
  const isValid = useRef(false);

  if (value?.id !== payee?.id) {
    setValue(payee);
    setCanSave(false);
    setIsInitialValue(true);
  }

  const closeDrawer = (redraw) => {
    setSavePromise(null);
    setDrawerOpen(false);
    if (onClose) onClose(redraw);
    dispatch(unsetPayeeDetails());
  };

  const onChange = (newValue) => {
    setValue(newValue);
    isInitialValue = false;
    setIsInitialValue(false);
    onStateChange();
  };

  const onStateChange = (valid) => {
    if (valid !== undefined) {
      isValid.current = valid;
    }

    if (!isInitialValue) {
      setCanSave(isValid.current);
    }
  };

  const onSave = () => {
    setSavePromise(dispatch(savePayee([value])).then(response => {
      if (response?.payload?.status === 200) {
        closeDrawer(true);
      }
    }));
  };

  const onChangedPaginationState = useCallback((sizePerPage, currentPage) => {
    // TODO: update filter param w/ search text
    setCountPerPage(sizePerPage);
    setPageIndex(currentPage);
  }, []);

  const Header = (
    <LoadingButton
      onClick={onSave}
      disabled={!canSave}
      loadingPromise={savePromise}>
      {intl.formatMessage({ id: 'save' })}
    </LoadingButton>
  );

  useEffect(() => {
    console.log('value = ', payee)
    const pValue = value || payee;
    if (pValue) {
      const realMethod = convertMethodRValue(pValue.method);
      pValue.method = realMethod || pValue.method;
    }
    console.log('value = ', pValue)
    setPayeeValue(pValue)
  }, [dispatch, value, payee]);

  useEffect(() => {
    if (payeeId > 0) {
      dispatch(fetchPayeeDetails(payeeId));
    }

  }, [dispatch, payeeId, intl])

  useEffect(() => {
    if (payeeId > 0) {
      setLoadungPromise(
        dispatch(
          getTransactionList(
            '',
            {},
            countPerPage > 0 ? countPerPage : 10,
            pageIndex + 1,
            false,
            payeeId
          )
        ).then((response) => { })
      );
    }
  }, [dispatch, countPerPage, pageIndex, payeeId]);

  useEffect(() => {
    setDrawerOpen(open);
  }, [open]);

  useEffect(() => {
    if (Array.isArray(transactionList.list)) {
      const cList = transactionList.list?.map((item, index) => {
        const newItem = item['_source'];
        //newItem["date"] = newItem["createdAt"];
        return newItem;
      });
      setConvertedListData({ list: cList, totalCount: transactionList.totalCount });
    }
  }, [transactionList])
  return (
    <EmoneyDrawer
      {...props}
      isOpen={drawerOpen}
      onClose={() => closeDrawer(false)}
      header={Header}>
      <EmoneyDrawerSection>
        <PayeeForm
          value={payeeValue}
          onChange={onChange}
          onStateChange={onStateChange}
          submitted={true}></PayeeForm>
      </EmoneyDrawerSection>

      <EmoneyDrawerSection>
        <TitleTypography>
          {intl.formatMessage({ id: 'transactions.title' })}
        </TitleTypography>
        <TransactionListTable
          list={convertedListData || { list: [], totalCount: 0 }}
          columns={transactionListColumn(intl)}
          onChangedPaginationState={onChangedPaginationState}
          loadingPromise={loadingPromise}
          onSelectTransactionItem={
            setSelectedTransaction
          } />

        <TransactionDetailDrawer
          drawerOpen={!!selectedTransaction}
          close={() => setSelectedTransaction(null)}
          description={
            selectedTransaction?.description
          }
        />
      </EmoneyDrawerSection>
    </EmoneyDrawer>
  );
};

const state = createStructuredSelector({
  payee: getPayeeDetails,
  transactionList: getTransactionListSelector
});
export default connect(state)(injectIntl(withMemo(PayeeDetailsDrawer)));
