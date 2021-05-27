import { Box, Grid, FormControl, InputLabel, Select, MenuItem, ButtonGroup, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { injectIntl } from 'react-intl';
import { TableHeaderFilters, TableHeaderCounts } from './constants';

import { UppercasedTypography } from '../../../components/helper';

const useStyles = makeStyles((theme) => ({
  formControl: {
    marginLeft: theme.spacing(2),
    minWidth: 120,
  }
}));

const DashboardTableHeader = ({title, filterState, onFilter, withCountSelection, intl, ...props}) => {
  const classes = useStyles();

  const updateFilter = (newState) => {
    const updateState = {
      ...filterState,
      ...newState
    };
    onFilter && onFilter(updateState);
  }

  const setCount = ({target:{value}}) => {
    const count = value;
    updateFilter({count});
  }

  const setFilter = (filter) => {
    updateFilter({filter});
  }

  return (
    <Box>
      <Grid container item justify="space-between" alignItems="center">
        <Box pb={1}>
          <Grid container item alignItems="center" sm={12}>
            <UppercasedTypography>
              {intl.formatMessage({id: title})}
            </UppercasedTypography>

            {withCountSelection && 
              <FormControl className={classes.formControl}>
                <InputLabel id="header-count-label">
                  {intl.formatMessage({id: 'dashboard.table.header-count-label'})}
                </InputLabel>
                <Select
                  labelId="header-count-label"
                  id="header-count"
                  value={filterState.count}
                  onChange={setCount}
                >
                  {
                    TableHeaderCounts.map((v, index) => <MenuItem key={index} value={v}>{v}</MenuItem>)
                  }
                </Select>
              </FormControl>}
          </Grid>
        </Box>

        <Box pb={1}>
          <Grid item>
              <ButtonGroup color="primary" size="small" aria-label="outlined primary button group">
                {TableHeaderFilters.map((f, index) => (
                  <Button key={index} onClick={() => setFilter(f)} variant={f.text === filterState.filter.text && 'contained'}>{intl.formatMessage({id: f.text})}</Button>
                ))}
              </ButtonGroup>
          </Grid>
        </Box>
      </Grid>
    </Box>
  )
}

export default injectIntl(DashboardTableHeader);