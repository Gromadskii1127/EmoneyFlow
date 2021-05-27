import React, { Fragment, useEffect, useCallback, useState } from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
// Project Components
import { TransactionList } from 'components';
import { withMemo } from 'components/HOC';
import { getTransactionList } from 'redux/selectors/AdminTransactionSelector';
import * as AdminTransactionActions from 'redux/actions/AdminTransactionActions';
import { getUserSetting } from 'redux/selectors/UserSelector';
import { transactionListColumn } from './columns';
// with width
import withWidth, { isWidthUp } from '@material-ui/core/withWidth';
import { /*format,*/ parseISO } from 'date-fns';
import { format, utcToZonedTime } from 'date-fns-tz'
import { DATE_FORMAT_TYPES } from 'constant'

const Transaction = ({ dispatch, intl, listData, width, userSetting }) => {
  const [keyword, setKeyword] = useState('');
  const [filter, setFilter] = useState({ fromDate: new Date(), toDate: new Date() });
  const [countPerPage, setCountPerPage] = useState(10);
  const [pageIndex, setPageIndex] = useState(0);
  const [isCalc, setIsCalc] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [isCallingApi, setIsCallingApi] = useState(false);

  const [convertedListData, setConvertedListData] = useState({
    totalCount: 0,
    list: [],
    calcAmount: {}
  });
  const [loadingPromise, setLoadungPromise] = useState();

  const onSearchTextChange = useCallback((searchText) => {
    // TODO: update filter param w/ search text
    setKeyword(searchText);
  }, []);
  const onChangedFilter = useCallback((filter) => {
    // TODO: update filter param w/ search text
    console.log('set filter = ', filter);
    setFilter(filter);
  }, []);

  const onChangedPaginationState = useCallback((sizePerPage, currentPage) => {
    // TODO: update filter param w/ search text
    setCountPerPage(sizePerPage);
    setPageIndex(currentPage);
    console.log('page per size current page ', sizePerPage, currentPage);
  }, []);
  const onCalcAmountOptionChange = useCallback((value) => {
    // TODO: Handle for calculate option change
    setIsCalc(value.target.checked);
  }, []);

  const onHandleOpenDrawer = useCallback((drawer) => {
    setOpenDrawer(drawer);
  }, []);
  useEffect(() => {
    if (isCallingApi) return;
    setIsCallingApi(true);
    setLoadungPromise(
      dispatch(
        AdminTransactionActions.getTransactionList(
          openDrawer,
          keyword,
          filter,
          countPerPage > 0 ? countPerPage : 10,
          pageIndex + 1,
          isCalc,
          userSetting?.timezone
        )
      )
    );
    setIsCallingApi(false);    
  }, [openDrawer, dispatch, keyword, filter, countPerPage, pageIndex, isCalc, intl, userSetting?.timezone, isCallingApi]);
  const formatInTimeZone = (date, fmt, tz) =>
    format(utcToZonedTime(date, tz),
      fmt,
      { timeZone: tz });
  useEffect(() => {

    if (Array.isArray(listData.list)) {
      const cList = listData.list?.map((item, index) => {
        const newItem = item['_source'];
        if (newItem['createdAt'] && newItem['createdAt'].length > 0) {
          const createdAt = parseISO(newItem['createdAt']);
          newItem['date'] = formatInTimeZone(createdAt, DATE_FORMAT_TYPES[userSetting?.dateformat || 'mdy'], userSetting?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone);
        } else {
          newItem['date'] = formatInTimeZone(new Date(), DATE_FORMAT_TYPES[userSetting?.dateformat || 'mdy'], userSetting?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone);
        }

        return newItem;
      });

      setConvertedListData({ list: cList, totalCount: listData.totalCount, calcAmount: listData?.calcAmount });
    }
  }, [listData, userSetting?.dateformat, userSetting?.timezone]);

  const grouping = !isWidthUp('lg', width);

  return (
    <Fragment>
      <TransactionList
        onSearchTextChange={onSearchTextChange}
        onChangedFilter={onChangedFilter}
        onChangedPaginationState={onChangedPaginationState}
        columns={transactionListColumn(intl)}
        transactionList={convertedListData}
        onCalcAmountOptionChange={onCalcAmountOptionChange}
        data={{ description: 'Transaction Description' }}
        isGrouping={grouping}
        loadingPromise={loadingPromise}
        onOpenDrawer={onHandleOpenDrawer}
      />
    </Fragment>
  );
};

const state = createStructuredSelector({
  listData: getTransactionList,
  userSetting: getUserSetting
});

export default withWidth()(connect(state)(injectIntl(withMemo(Transaction))));
