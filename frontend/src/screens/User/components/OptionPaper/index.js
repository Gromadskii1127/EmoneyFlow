import { useState } from 'react';
import { Paper, Box, Grid, Typography, ButtonBase } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import {injectIntl } from 'react-intl';

import { withMemo } from 'components/HOC';
import { BoldTypography } from '../helper';

const useStyle = makeStyles(theme => ({
  grid: {
    [theme.breakpoints.up('sm')]: {
      width: '250px'
    },
    [theme.breakpoints.only('xs')]: {
      width: '100%'
    },
  },
  fillVertical: {
    width: '100%'

  },
  caption: {
    maxWidth: '180px',
    fontSize: '14px',
    color: '#05243F'
  },
  paper: {
    cursor: 'pointer',
    width: '100%'
  },
  title: {
    fontSize: '18px'
  }
}));

const OptionPaper = ({ id, icon, intl, ...props }) => {
  const classes = useStyle();
  const [elevation, setElevation] = useState(1);

  return (
    <ButtonBase className={classes.fillVertical}>
      <Paper elevation={elevation} onMouseOut={() => setElevation(1)} onMouseOver={() => setElevation(0)} className={classes.paper} key={id}>
        <Box className={classes.fillVertical} py={3} px={5}>
          <Grid container item className={classes.fillVertical} direction="column" alignItems="center">
            {icon}

            <Box py={1}>
              <BoldTypography className={classes.title}>
                {intl.formatMessage({id})}
              </BoldTypography>
            </Box>

            <Typography className={classes.caption} variant="caption" color="textSecondary">
              {intl.formatMessage({id:`${id}.caption`})}
            </Typography>
          </Grid>
        </Box>
      </Paper>
    </ButtonBase>
  );
}

export default injectIntl(withMemo(OptionPaper));