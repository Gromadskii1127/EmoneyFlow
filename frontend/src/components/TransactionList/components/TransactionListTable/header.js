import React, { Fragment } from 'react';
import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { injectIntl, FormattedMessage } from 'react-intl';
import { EmoneyFormattedNumber } from 'components'
const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: '#DEE4ED5C',
    minHeight: '60px',
    paddingLeft: '65px',
    paddingRight: '65px',
    paddingTop: '5px',
    paddingBottom: '5px'
  },
  title: {
    fontWeight: 'bold',
    fontSize: '12px',
  },

  price: {
    color: '#666666',
    textAlign: 'right'
  }

}));

const SubHeader = ({ intl, calcAmount, isShow = true }) => {
  const classes = useStyles();

  if (isShow === true) {
    return (
      <Grid container className={classes.root}>
        <Grid item md={5} xs={12} container direction="row">
          <Grid container item md={12} xs={8}>
            <Grid item md={4} xs={4} className={classes.title}>
              <FormattedMessage
                id="emoney.total.amount"
                defaultMessage="TOTAL AMOUNT"
              />
            </Grid>
            <Grid item md={4} xs={4} className={classes.price}>
              <EmoneyFormattedNumber
                styleType={'currency'}
                currency={'EUR'}
                number={calcAmount?.totalPrice || 0}
              />
            </Grid>
            <Grid item md={4} xs={4} className={classes.price}>
              <EmoneyFormattedNumber
                styleType={'currency'}
                currency={'EUR'}
                number={calcAmount?.queryPrice || 0}
              />
            </Grid>
          </Grid>
          <Grid container item md={12} xs={8}>
            <Grid item md={4} xs={4} className={classes.title}>
              <FormattedMessage
                id="emoney.transactions"
                defaultMessage="TRANSACTIONS"
              />
            </Grid>
            <Grid item md={4} xs={4} className={classes.price}>
              {
                calcAmount?.totalCount || 0
              }
            </Grid>
            <Grid item md={4} xs={4} className={classes.price}>
              {
                calcAmount?.queryCount || 0
              }
            </Grid>
          </Grid>
          <Grid container item md={12} xs={8}>
            <Grid item md={4} xs={4} className={classes.title}>
              <FormattedMessage
                id="emoney.total.fees"
                defaultMessage="TOTAL FEES"
              />
            </Grid>
            <Grid item md={4} xs={4} className={classes.price}>
              <EmoneyFormattedNumber
                styleType={'currency'}
                currency={'EUR'}
                number={calcAmount?.totalFeePrice || 0}
              />
            </Grid>
            <Grid item md={4} xs={4} className={classes.price}>
              <EmoneyFormattedNumber
                styleType={'currency'}
                currency={'EUR'}
                number={calcAmount?.queryFeePrice || 0}
              />

            </Grid>
          </Grid>
        </Grid>
      </Grid>
    )
  } else {
    return (<Fragment />)
  }

};
export default injectIntl(SubHeader);
