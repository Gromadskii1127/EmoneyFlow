import React, { useCallback } from 'react';
import { Grid } from '@material-ui/core';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import _ from 'lodash';

// Project Components
import { withMemo } from 'components/HOC';
import { PayeeAutoComplete } from './components';
import * as AddPayoutActions from 'redux/actions/AddPayoutActions';
import { getUserData } from 'redux/selectors/AddPayoutSelector';

const SubHeader = ({ dispatch, routeKey, userData, submitted}) => {

  const handleValueChange = useCallback((v) => {
    const list = userData[routeKey]?.list || [];
    var isExist = false;
    for (var i = 0; i < list.length; i++) {
      if (list[i].id === v.id) {
        isExist = true;
      }
    }
    v['reference'] = '';
    v['amount'] = '';
    if (!isExist)
      dispatch(AddPayoutActions.saveData(routeKey, _.extend({}, state, {
        list: [].concat(list, v),
      })));
  }, [routeKey, userData, dispatch]);
  const handleAddNewPayee = useCallback((v) => {

  }, []);

  return (
    <Grid container className="bg-white user-single-payout-subheader">
      <Grid item xs={12} md={6}>
        <div className="p-4">
          <PayeeAutoComplete
            submitted={submitted}
            onChange={handleValueChange}
            onAddPayee={handleAddNewPayee} />
        </div>

      </Grid>
    </Grid>
  );
};
const state = createStructuredSelector({
  userData: getUserData
});
export default connect(state)(injectIntl(withMemo(SubHeader)));

