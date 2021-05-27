import React, { useCallback, useState, useEffect } from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Grid } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
// Project Components
import { EmoneyTable } from 'components';
import { SubHeader, PayoutOption } from './components';
import { withMemo } from 'components/HOC';
import { getUserData } from 'redux/selectors/AddPayoutSelector';
import SelectPayeeColumns from './columns';
import { getLocalPayouts } from 'redux/selectors/PayoutSelector';
import { getUserSetting } from 'redux/selectors/UserSelector';
import * as PayoutActions from 'redux/actions/PayoutActions'
// Utils
import { replaceElement } from 'utils/array_utils';
import { format, utcToZonedTime } from 'date-fns-tz'
import { DATE_FORMAT_TYPES } from 'constant'
const Payout = ({ intl, dispatch, userData, pathes, payoutDatas, userSetting,  currentPathIndex, path, exitUrl, submitted, ...props }) => {
  const isLastStep = pathes.length === currentPathIndex + 1;
  const nextRoute = !isLastStep
    ? pathes[currentPathIndex + 1]
    : exitUrl;
  const showNext = !!nextRoute;
  const history = useHistory();

  const formatInTimeZone = (date, fmt, tz) =>
    format(utcToZonedTime(date, tz),
      fmt,
      { timeZone: tz });

  const convertedDate = useCallback((date) => {
    new Date(formatInTimeZone(date, DATE_FORMAT_TYPES[userSetting?.dateformat || 'mdy'], userSetting?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone))
  }, [userSetting?.dateformat, userSetting?.timezone]);



  const [editingRows, setEditingRows] = useState([]);
  const [payoutList, setPayoutList] = useState([]);
  const [optionValues, setOptionValues] = useState({ dateType: "today", reference: "", dateValue: convertedDate(new Date()) });
  const handleSelectRow = useCallback(() => {

  }, []);

  const checkValidation = useCallback((event) => {
    if (payoutList.count === 0) {
      return false;
    }
    for (var i = 0; i < payoutList.length; i++) {
      const payout = payoutList[i];
      console.log('payout = ', payout);
      if (payout['amount'] === '') {
        return false;
      }
    }
    return true;
  }, [payoutList]);
  
  const handleClickContinue = useCallback(() => {
    if (checkValidation()) {
      const list = payoutList.map((element) => {
        return { reference: element['reference'], payeeId: element['id'], amount: element['amount'], currency: element['currency'] }
      })
      dispatch(PayoutActions.savePayouts(list, optionValues));
      history.push(nextRoute);
    } else {
      history.push(props.location.pathname + '?submitted=true');
    }
  }, [dispatch, checkValidation, history, nextRoute, props.location.pathname, payoutList, optionValues]);

  const handleChangeValue = useCallback(({ index, id, name, value }) => {
    replaceElement(payoutList, "id", id, name, value);
  }, [payoutList]);

  const handleChangeOptionValue = useCallback((name, value) => {
    setOptionValues(values => ({
      ...values,
      [name]: value
    }));
  }, []);

  useEffect(() => {
    setOptionValues(payoutDatas?.option || { dateType: "today", reference: "", dateValue: convertedDate(new Date()) });
  }, [payoutDatas?.option, convertedDate])
  useEffect(() => {
    const list = userData[path]?.list || [];
    setPayoutList(list);
    let rows = [];
    list.forEach((element, index) => {
      rows.push(index);
    });
    setEditingRows(rows);
  }, [userData, path]);

  return (
    <Grid container direction="row" spacing={2}>
      <Grid item>
        <EmoneyTable
          data={payoutList}
          columns={SelectPayeeColumns(dispatch, intl, userData, payoutList, submitted, handleChangeValue)}
          isGrouping={false}
          grouping={{
            field: 'date'
          }}
          isSelectable={true}
          onSelected={handleSelectRow}
          totalCount={100}
          isPagination={false}
          isSubHeader={true}
          subHeader={<SubHeader routeKey={path} submitted={submitted} />}
          className="trans-table"
          isEditing={true}
          editingRowIds={editingRows}
        />
      </Grid>
      <PayoutOption
        showNext={showNext}
        nextRoute={nextRoute}
        path={path}
        handleClickNext={handleClickContinue}
        values={optionValues}
        handleChangeOptionValue={handleChangeOptionValue} />
    </Grid>
  )
}
const state = createStructuredSelector({
  userData: getUserData,
  payoutDatas: getLocalPayouts,
  userSetting: getUserSetting
});
export default connect(state)(injectIntl(withMemo(Payout)));
