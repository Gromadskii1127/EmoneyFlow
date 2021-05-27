import React, { useState, useCallback, useEffect } from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import styled from 'styled-components';
import { Container, Grid, Typography, Button } from '@material-ui/core';
import { Link, useHistory } from 'react-router-dom';
import { format, utcToZonedTime } from 'date-fns-tz'

import PayInfoItem from './PayInfoItem';
import { map, last } from 'lodash';
import { getUserData } from 'redux/selectors/AddPayoutSelector';
import { getLocalPayouts } from 'redux/selectors/PayoutSelector';
import { getUserSetting } from 'redux/selectors/UserSelector';
import { withMemo } from 'components/HOC';
import { LoadingButton } from 'components'
import * as PayoutActions from 'redux/actions/PayoutActions';
import * as AddPayoutActions from 'redux/actions/AddPayoutActions';
import { DATE_FORMAT_TYPES } from 'constant'


const PayInfoContainer = styled(Grid)`
  border-bottom: 1px solid #22eec1;
`;

const Icon = styled.span`
  font-size: 53px;
  color: #22eec1;
`;

const SummaryButton = styled(Button)`
  @media screen and (max-width: 600px) {
    width: 100%;
  }
`

const Summary = ({ dispatch, intl, pathes, currentPathIndex, payoutDatas, path, userSetting, userData, option, exitUrl, paymentValue, paymentDate, ...props }) => {
  const isLastStep = pathes.length === currentPathIndex + 1;
  const nextRoute = !isLastStep
    ? pathes[currentPathIndex + 1]
    : exitUrl;
  const prevRoute = currentPathIndex > 0 && pathes[currentPathIndex - 1];
  const steps = map(pathes, p => last(p.split('/')));
  const showNext = !!nextRoute;
  const showPrev = !!prevRoute && steps[currentPathIndex] !== 'complete';
  const prevRouteKey = steps[currentPathIndex - 1];
  const history = useHistory();

  const [isLoading, setIsLoading] = useState(false);
  const [amounts, setAmounts] = useState({});
  const [payoutList, setPayoutList] = useState([]);
  const [optionData, setOptionData] = useState({});
  const handleCompletPayment = useCallback(() => {
    setIsLoading(true);
    dispatch(AddPayoutActions.saveData(path, {
      isLoading: true
    }))

    dispatch(PayoutActions.executePaymentByUpload(payoutList, optionData)).then(response => {
      setIsLoading(false);     
      dispatch(
        AddPayoutActions.saveData(path, {
          isLoading: false
        })
      );
      dispatch(
        AddPayoutActions.saveData(prevRouteKey, {
        })
      );
      if (response?.payload?.status === 200) {
        history.push(nextRoute);
        
      } else {
        //TODO
        //dispatch(addError({ type: 0, message: intl.formatMessage({ id: 'user.payee.overview.getting.error' }), from: 'UserPayee' }));
      }
    });
  }, [dispatch, payoutList, optionData, history, nextRoute, prevRouteKey, path]);


  useEffect(() => {
    setIsLoading(false);
    const list = payoutDatas?.list || [];
    console.log('list = ', payoutDatas);
    setPayoutList(list);
    setOptionData(payoutDatas?.option || {});
    const mAmounts = {};
    list.forEach((element, index) => {
      const currency = element['currency'];
      const amount = element['amount'];
      const sumAmount = mAmounts[currency];
      if (sumAmount) {
        mAmounts[currency] = sumAmount + parseInt(amount);
      } else {
        mAmounts[currency] = parseInt(amount);
      }
    });
    setAmounts(mAmounts);
  }, [payoutDatas, currentPathIndex, prevRouteKey]);
  
  
  const formatInTimeZone = (date, fmt, tz) =>
    format(utcToZonedTime(date, tz),
      fmt,
      { timeZone: tz });


  
  useEffect(() => {
    setIsLoading(userData[path]?.isLoading || false);
  }, [userData, path])
  return (
    <React.Fragment>
      <Container maxWidth="sm">
        <PayInfoContainer
          container
          direction="column"
          spacing={4}
          alignItems="center"
          justify="center">
          <Grid item>
            <Icon className="emicon-payouts" />
          </Grid>
          <Grid item>
            {
              Object.keys(amounts).map((key, index) => {
                return (
                  <PayInfoItem key={index} currency={key} value={amounts[key]} />
                )

              })
            }
          </Grid>
          <Grid item>
            <Typography variant="h6">
              {intl.formatMessage({ id: "emoney.excution.date:" })} { ' '} 
              {                
                optionData?.dateType === "today" ? intl.formatMessage({ id: "emoney.today" }) :                 
                optionData?.dateType === "on" && (optionData?.dateValue === undefined || optionData?.dateValue === "") ?
                  formatInTimeZone(new Date(), DATE_FORMAT_TYPES[userSetting?.dateformat || 'mdy'] , { timezone: userSetting?.timezone || "UTC" }) 
                  : (optionData?.dateValue) ? formatInTimeZone(optionData?.dateValue, DATE_FORMAT_TYPES[userSetting?.dateformat || 'mdy'] , { timezone: userSetting?.timezone || "UTC " }) : ""
              }

            </Typography>
          </Grid>
        </PayInfoContainer>
      </Container>
      <Container className="mt-6">
        <Grid container alignItems="center" justify="center" direction="column">
          <Grid item>
            {showPrev && (
              <Link to={prevRoute}>
                <SummaryButton variant="contained" className="m-2">
                  {intl.formatMessage({ id: 'emoney.edit' })}
                </SummaryButton>
              </Link>
            )}
            {showNext && (
              <LoadingButton
                onClick={handleCompletPayment}
                disabled={isLoading || payoutList.length === 0}
                isLoading={isLoading}
                color="primary"
                variant="contained"
                className="m-2">
                {intl.formatMessage({ id: 'emoney.complete-payment' })}
              </LoadingButton>
            )}
          </Grid>
        </Grid>
      </Container>
    </React.Fragment>
  );
};
const state = createStructuredSelector({
  userData: getUserData,
  payoutDatas: getLocalPayouts,
  userSetting: getUserSetting
});
export default connect(state)(injectIntl(withMemo(Summary)));
