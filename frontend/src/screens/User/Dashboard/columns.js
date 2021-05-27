import { isUndefined } from 'lodash';
import { Box, Grid } from '@material-ui/core';

import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import { methodValues } from 'constant';

const methodNameFromValues = (method) => {
  for (var i = 0 ; i < methodValues.length; i++){
    if (methodValues[i].rvalue === method){
      return methodValues[i].name;
    }
  }
  return "method.SEPA"
}
export const TopPayeesColumns = (intl, theme) => ([{
  title: intl.formatMessage({ id: "dashboard.table.header.beneficiary" }),
  name: "beneficiary",
  width: '80%',
  Cell: (row, column, value) => {
    return (
      <Box pr={4}>
        <Grid container spacing={1}>
          <Grid item md={6} sm={12}>
            {value.id} - {value.name}
          </Grid>
          {value.compare && <Grid container item md={6} sm={12} justify="flex-end">
            {intl.formatMessage({id: 'dashboard.table.content.compare'}, value.compare)}
          </Grid>}
        </Grid>
      </Box>
    );
  }
}, {
  title: intl.formatMessage({ id: "dashboard.table.header.amount" }),
  name: "amount",
  width: '20%',
  Cell: (row, column, value) => {
    const Icon = (value.hasIncreased
      ? <ArrowDropUpIcon style={{ color: theme.palette.success.main }}></ArrowDropUpIcon>
      : <ArrowDropDownIcon style={{ color: theme.palette.error.main }}></ArrowDropDownIcon>);
    return (
      <Grid container alignItems="center" spacing={2}>
        {!isUndefined(value.hasIncreased) && Icon}

        {intl.formatNumber(value.value, {style: 'currency', currency: 'EUR'})}
      </Grid>
    );
  }
}]);

export const FeesColumns = (intl, theme) => ([{
  title: intl.formatMessage({ id: "dashboard.table.header.payout-methode" }),
  name: "payoutMethode",
  width: '70%',

  Cell: (row, column, value) => {
    console.log('row = ', row)
    return intl.formatMessage({ id: methodNameFromValues(row?.api?.apiType)})
  }
}, {
  title: intl.formatMessage({ id: "dashboard.table.header.transactions" }),
  name: "count",
}, {
  title: intl.formatMessage({ id: "dashboard.table.header.amount" }),
  name: "total_amount",
  Cell: (row, column, value) => {
    return intl.formatNumber(value, {style: 'currency', currency: row.currency ? row.currency : 'EUR'})
  }
}]);