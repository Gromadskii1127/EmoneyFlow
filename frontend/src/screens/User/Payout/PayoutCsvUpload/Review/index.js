import { useState, useCallback, useEffect } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { useHistory } from 'react-router-dom';
import { Box, Grid, FormControlLabel, RadioGroup, Radio } from '@material-ui/core';
import { injectIntl } from 'react-intl';
import { transform, map } from 'lodash';

import {
  fetchPayeeList,
} from 'redux/actions/PayeeActions';
import { savePayouts } from 'redux/actions/PayoutActions';
import { getUserData } from 'redux/selectors/PayoutUploadCsvSelector';
import { getPayeeList } from 'redux/selectors/PayeeSelector';
import { EmoneyDatePicker, LoadingButton, EmoneyTable } from 'components';
import ReviewColumns from './columns';

const Review = ({ path, dispatch, intl, children, pathes, currentPathIndex, exitUrl, payeeList, ...props }) => {
  const isLastStep = pathes.length === currentPathIndex + 1;
  const nextRoute = !isLastStep
    ? pathes[currentPathIndex + 1]
    : exitUrl;  
  const history = useHistory();
  const mappings = props.userData.fields?.mapping || {};
  const data = map(props.userData.upload?.csvData, i => transform(i, (r, v, k) => {
    Object.keys(mappings).forEach((key, index) => {
      const value = mappings[key];
      if (value === k) {
        r[key] = v;
      }
    })
  }, {}));

  const [isLoading, setIsLoading] = useState(false);
  const [dateType, setDateType] = useState('today');
  const [dateValue, setDateValue] = useState(new Date());

  const handleChangeDateType = useCallback((event) => {
    setDateType(event.target.value);
  }, [])

  const handleDateValueChanged = useCallback((value) => {
    setDateValue(value)
  }, []);

  const checkEqualPayee = useCallback((payeeItem, dataItem) => {
    console.log(' compare ', payeeItem, dataItem)
    return payeeItem['email'] === dataItem['email']
      && payeeItem['firstName'] === dataItem['firstName']
      && payeeItem['lastName'] === dataItem['lastName']
      && payeeItem['bankName'] === dataItem['bankName']
      && payeeItem['iban'] === dataItem['iban']
      && payeeItem['bic'] === dataItem['bic']
  }, [])
  const handleClickContinue = useCallback((event) => {
    setIsLoading(true);
    console.log('payee list ', data);
    dispatch(fetchPayeeList("", 0, 0)).then(response => {
      
      setIsLoading(false);
      const list = [];
      for (var i = 0; i < data.length; i++) {
        const dataItem = data[i];
        console.log('data item = ', dataItem)
        for (var j = 0; j < payeeList?.list.length; j++) {
          const payeeItem = payeeList?.list[j];
          console.log('payee Item = ', payeeItem);
          if (checkEqualPayee(payeeItem, dataItem)){
            //const listItem = Object.assign({}, payeeItem);
            const listItem = {};
            listItem['reference'] = dataItem['reference'];
            listItem['payeeId'] = payeeItem['id'];
            listItem['amount'] = dataItem['amount'];
            listItem['method'] = payeeItem['method'];
            listItem['currency'] = payeeItem['currency'];            
            list.push(listItem);
            break;
          }
        }
      }
      dispatch(savePayouts(list, {
        dateValue: dateValue,
        dateType: dateType
      }))
      history.push(nextRoute);
    });


  }, [dispatch, payeeList, data, nextRoute, history, dateValue, dateType, checkEqualPayee])

  useEffect(() => {

  }, [dispatch]);
  return (
    <Box>
      <EmoneyTable
        data={data}
        columns={ReviewColumns(intl)}
      />
      <Grid item container>
        <Grid item xs={12} md={7}>
        </Grid>
        <Grid item container spacing={2} xs={12} md={5} direction="column">
          <Grid item container className="mt-3">
            <div className="d-flex flex-row">
              <FormControlLabel
                control={<div />}
                label={intl.formatMessage({ id: "user.payout.global.date", defaultMessage: "Date:" })}
                classes={{ label: "font-medium font-bold font-cursor-default", root: "ml-0 mr-4" }}
                labelPlacement="start"
              />
              <RadioGroup row name="dateType" defaultValue={"today"} onChange={handleChangeDateType}>
                <FormControlLabel
                  value="today"
                  control={<Radio color="primary" />}
                  label={intl.formatMessage({ id: "emoney.today", defaultMessage: "Today" })}
                  classes={{ label: "font-medium font-bold" }}
                  labelPlacement="end"
                />
                <FormControlLabel
                  value="on"
                  control={<Radio color="primary" />}
                  label={intl.formatMessage({ id: "emoney.on", defaultMessage: "On" })}
                  classes={{ label: "font-medium font-bold" }}
                  labelPlacement="end"
                />
              </RadioGroup>
            </div>
          </Grid>
          {
            dateType === "on" && (
              <Grid item xs={12} md={12}>
                <EmoneyDatePicker
                  value={dateValue}
                  onChange={handleDateValueChanged}
                  adId="user.payout.execution.date"
                  adDefaultMessage="Execution Date:"
                  placeholderId="admin.transaction.search.filter.date.placeholder"
                  placeholderDefault="dd.mm.yyy"
                />
              </Grid>
            )
          }
          <Grid item className="user-payout-bottom-border mt-5">

          </Grid>
          <Grid item container direction="row-reverse" spacing={0}>
            <LoadingButton
              isLoading={isLoading}
              disabled={isLoading}
              variant="contained"
              onClick={handleClickContinue}
              color="primary">
              {intl.formatMessage({ id: "emoney.continue" })}
            </LoadingButton>
          </Grid>
        </Grid>
      </Grid>
    </Box>

  );
}

const state = createStructuredSelector({
  userData: getUserData,
  payeeList: getPayeeList,
});
export default connect(state)(injectIntl(Review));