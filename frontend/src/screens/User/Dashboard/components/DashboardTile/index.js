import React from 'react';
import {
  Typography
} from '@material-ui/core';
import { withMemo } from 'components/HOC';
import { withTheme } from '@material-ui/core/styles';
import { injectIntl } from 'react-intl';
import Skeleton from '@material-ui/lab/Skeleton';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { UppercasedTypography } from '../../../components/helper';
import ColoredLineProgress from './coloredLineProgress';
import { DashboardTileType } from './constants';

const DashboardTile = ({ title, type, isLoading, userData, theme, intl, ...props }) => {  
  const tileData = DashboardTileType[type];
  const typeColor = theme.palette[tileData.color];

  const TypeTextComponent = (isLoading
    ? <Skeleton variant="text" />
    : <UppercasedTypography variant="caption" style={{color: typeColor.main}}>
      {intl.formatMessage(tileData.translation)}
    </UppercasedTypography>);

  const IconComponent = (isLoading
    ? <Skeleton variant="circle" width={40} height={40} />
    : <tileData.icon style={{color: typeColor.main}}/>);

  const AmountComponent = (isLoading
    ? <Skeleton variant="text" />
    : <Typography style={{flex: 1}} variant="h3">
        {intl.formatNumber(userData?.amount || '0', {style: 'currency', currency: 'EUR'})}
      </Typography>);

  const PercentageComponent = (isLoading
    ? <Skeleton variant="text" />
    : <Typography variant="caption" color="textSecondary">
      {intl.formatNumber(userData?.percentage || '0', {style: 'percent', maximumFractionDigits:0})}
    </Typography>);

  const ProgressComponent = (isLoading
    ? <ColoredLineProgress light={typeColor.light} main={typeColor.main}/>
    : <ColoredLineProgress variant="determinate" value={(userData?.percentage || 0)*100} light={theme.palette.grey['200']} main={typeColor.main}/>)

  return (
    <Paper>
      <Box p={3}>
        <Grid p={3}>
          <Grid container item justify="space-between" xs={12}>
            <UppercasedTypography variant="caption">
              {intl.formatMessage({ id: title })}
            </UppercasedTypography>
            {TypeTextComponent}
          </Grid>
          <Box my={2}>
            <Grid container alignItems="center" spacing={2}>
              <Grid item>
                {IconComponent}
              </Grid><Grid item xs>
                {AmountComponent}
              </Grid><Grid item>
                {PercentageComponent}
              </Grid>
            </Grid>
          </Box>
          <Box mb={1} mt={3}>
            <Grid container item xs={12}>
              {ProgressComponent}
            </Grid>
          </Box>
        </Grid>
      </Box>
    </Paper>
  )
};

export default withTheme(injectIntl(withMemo(DashboardTile)));