import React from 'react';
import { injectIntl } from 'react-intl';
import clsx from "clsx";
import format from "date-fns/format";
import isSameDay from "date-fns/isSameDay";
import { find } from 'lodash';
import {
  Typography,
  Tooltip,
  Grid,
  Box,
  Badge,
  IconButton
} from '@material-ui/core';
import { withTheme, withStyles, makeStyles } from '@material-ui/core/styles';
import { DatePicker } from "@material-ui/pickers";
import { withMemo } from 'components/HOC';

const useStyles = makeStyles({
  day: ({theme}) => ({
    width: 36,
    height: 36,
    fontSize: theme.typography.caption.fontSize,
    margin: "0 2px",
    color: "inherit",
  }),
  customDayHighlight: ({theme}) => ({
    position: "absolute",
    top: 0,
    bottom: 0,
    left: "2px",
    right: "2px",
    border: `1px solid ${theme.palette.secondary.main}`,
    borderRadius: "50%",
  }),
  nonCurrentMonthDay: ({theme}) => ({
    color: theme.palette.text.disabled,
  }),
  highlight: ({theme}) => ({
    background: theme.palette.grey['200']
  }),
  badgeFinished: ({theme}) => ({
    backgroundColor: theme.palette.success.main
  }),
  badgeScheduled: ({theme}) => ({
    backgroundColor: theme.palette.primary.main
  }),
  notassigned: ({theme}) => ({
    color: theme.palette.error.main,
    textTransform: 'uppercase',
    fontWeight: 'bold'
  }),
  success: ({theme}) => ({
    color: theme.palette.success.main,
    textTransform: 'uppercase',
    fontWeight: 'bold'
  }),
  error: ({theme}) => ({
    color: theme.palette.error.main,
    textTransform: 'uppercase',
    fontWeight: 'bold'
  }),
  pending: ({theme}) => ({
    color: theme.palette.warning.main,
    textTransform: 'uppercase',
    fontWeight: 'bold'
  }),
  declined: ({theme}) => ({
    color: 'rebeccapurple',
    textTransform: 'uppercase',
    fontWeight: 'bold'
  })
});

const StyledBadge = withStyles((theme) => ({
  badge: {
    right: 20,
    top: 30,
  },
  colorPrimary: {}
}))(Badge);

const DummyArrowIcon = (<Box style={{width: 36, height: 36}}></Box>)

const DashboardDebitCalendarMonth = ({ date, debits, theme, intl, ...props }) => {
  const classes = useStyles({theme});
  const stringFromStatus = (status) => {
    return status === 0 ? "notassigned" : 
    status === 1 ? "success" :
    status === 2 ? "error" :
    status === 3 ? "pending" : "declined"
  }
  const renderTooltipContent = (debit) => {
    return (
      <div>
        {debit.payments.map((p, index) => {
          const scheduledText = intl.formatMessage({id: 'calendar.tooltip.' + stringFromStatus(p.status)});
          const amountText = intl.formatNumber(p.total, {style: 'currency', currency: p.currency});
          const stateColorClass = classes[stringFromStatus(p.status)];
          const id = `${date.toISOString()}-${p.type}`;
          return (
            <Box key={id} m={1}>
              <Grid container item direction="row" spacing={2} key={index}>
                <Typography variant="caption" style={{width: 100}}>{amountText}</Typography>
                <Typography variant="caption" color="inherit" className={stateColorClass}>{scheduledText}</Typography>
              </Grid>
            </Box>
          )
        })}
      </div>
    )
  }

  const renderWrappedWeekDay = (date, selectedDate, dayInCurrentMonth) => {
    const {badgeFinished, badgeScheduled} = classes;
    const currentDebit = find(debits, d => format(date,'yyyy-MM-dd') === d.date);    
    const isToday = isSameDay(new Date(), date) && dayInCurrentMonth;

    const dayClassName = clsx(classes.day, {
      [classes.nonCurrentMonthDay]: !dayInCurrentMonth,
      [classes.highlight]: isToday
    });

    if (currentDebit) {
      const badgeClass = (currentDebit.isFinished
        ? badgeFinished
        : badgeScheduled);

      return (
        <Tooltip
          title={
            <Box p={1}>
              {renderTooltipContent(currentDebit)}
            </Box>
          }
        >
          <StyledBadge 
            color="primary"
            classes={badgeClass && {colorPrimary:badgeClass}}
            variant="dot">
            <IconButton className={dayClassName}>
              <span> {format(date, "d")} </span>
            </IconButton>
          </StyledBadge>
        </Tooltip>
      );
    }

    return (
      <IconButton className={dayClassName}>
        <span> {format(date, "d")} </span>
      </IconButton>
    );
  };

  return (
    <DatePicker
      autoOk
      orientation="landscape"
      variant="static"
      openTo="date"
      disableToolbar={true}
      readOnly={true}
      rightArrowIcon={DummyArrowIcon}
      disablePast={true}
      leftArrowIcon={DummyArrowIcon}
      disableFuture={true}
      value={date}
      onChange={() => {}}
      renderDay={renderWrappedWeekDay}
    />
  )
};

export default withTheme(injectIntl(withMemo(DashboardDebitCalendarMonth)));