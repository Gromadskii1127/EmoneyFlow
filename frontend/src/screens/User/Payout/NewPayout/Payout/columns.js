import { useCallback, useState } from 'react';
import { Button, Grid, Tooltip } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import {
  AdormentTextField
} from 'components';
import * as AddPayoutActions from 'redux/actions/AddPayoutActions';
const {
  getIndexInArray
} = require('utils/array_utils');

const routeKey = "payout"

const SelectPayeeColumns = (dispatch, intl, userData, payoutList, submitted, handleChangeValue) => {
  return [
    {
      title: "",
      name: "",
      shouldShow: false,
      EditingCell: ((props) => {
        const handleClose = useCallback((event) => {
          let index = getIndexInArray(payoutList, "id", props.row.id);
          if (index !== -1) {
            const list = userData[routeKey]?.list || [];            
            dispatch(AddPayoutActions.saveData(routeKey, { ...userData[routeKey], list: [].concat(list.slice(0, index), list.slice(index + 1)) }));
          }
        }, [props])
        return (
          <td className="MuiTableCell-root">
            <Tooltip
              classes={{ tooltip: "trans-drawer-button-tooltip", arrow: "trans-drawer-button-arrow" }}
              arrow
              title={intl.formatMessage({ id: "emoney.cancel", defaultMessage: "Cancel" })}
              placement="top"
            >
              <Button aria-label="close" size="medium" className="company-drawer-close-button" onClick={handleClose}>
                <CloseIcon fontSize="large" />
              </Button>
            </Tooltip>
          </td>

        )
      }),
    },
    {
      title: intl.formatMessage({
        id: 'emoney.beneficiary',
        defaultMessage: 'BENEFICIARY'
      }),
      name: 'beneficiary',
      Cell: (row, column, value) => {
        return (
          <Grid container spacing={2} className="pl-2 pt-2 pb-2">
            <Grid item md={5}>{row.affiliateId}</Grid>
            <Grid item md={7}><span>{row.firstName} {row.lastName}</span></Grid>
          </Grid>
        );
      },
      EditingCell: ((props) => {
        return (
          <td className="MuiTableCell-root">
            <Grid container spacing={2} className="pl-2 pt-2 pb-2">
              <Grid item md={5}>{props.row.affiliateId}</Grid>
              <Grid item md={7}><span>{props.row.firstName} {props.row.lastName}</span></Grid>
            </Grid>
          </td>

        )
      }),
    },
    {
      title: intl.formatMessage({
        id: 'emoney.referenz',
        defaultMessage: 'REFERENZ'
      }),
      name: 'reference',
      EditingCell: ((props) => {
        console.log('props = ', props)  ;
        const [value, setValue] = useState(props.row[props.column.name] || '');
        const handleChange = useCallback((event) => {   
          setValue(event.target.value)
          if (handleChangeValue){
            handleChangeValue({index: props.tableRow.rowId, id: props.row.id, name: props.column.name, value: event.target.value});
          }
        }, [props]);
        return (
          <td className="emoney-table-td MuiTableCell-root">
            <AdormentTextField
              value={value}
              fullWidth
              placeholder={intl.formatMessage({ id: "user.payout.table.referenz", defaultMessage: "Leave empty for global Ref." })}              
              onChange={handleChange}              
              required={true}
              submitted={submitted}
              
            />
          </td>
        )
      })

    },
    {
      title: intl.formatMessage({
        id: 'emoney.amount.upper',
        defaultMessage: 'AMOUNT'
      }),
      name: 'amount',
      EditingCell: ((props) => {       
        const [value, setValue] = useState(props.row[props.column.name] || '');
        const handleChange = (event) => {
          setValue(event.target.value)
          if (handleChangeValue){
            handleChangeValue({index: props.tableRow.rowId, id: props.row.id, name: props.column.name, value: event.target.value});
          }
        }
        return (
          <td className="emoney-table-td MuiTableCell-root">
            <AdormentTextField
              value={value}
              placeholder={intl.formatMessage({ id: "user.payout.table.amount", defaultMessage: "Amount" })}              
              onChange={handleChange}
              required={true}
              submitted={submitted}
              type={'Number'}
            />
          </td>
        )
      })
    },
  ];
};

export default SelectPayeeColumns;
