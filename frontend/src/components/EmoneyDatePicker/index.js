import React, { } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import clsx from "clsx";
import {
  IconButton
} from '@material-ui/core';
// Components
import { KeyboardDatePicker } from '@material-ui/pickers';
import { AdormentTextField } from 'components';
// Redux
import { getUserSetting } from 'redux/selectors/UserSelector';
import { withTheme, makeStyles } from '@material-ui/core/styles';
import { DATE_FORMAT_TYPES } from 'constant'
import { withMemo } from 'components/HOC';
import isSameDay from "date-fns/isSameDay";
import { format } from 'date-fns-tz'
const useStyles = makeStyles({
  day: ({ theme }) => ({
    width: 36,
    height: 36,
    fontSize: theme.typography.caption.fontSize,
    margin: "0 2px",
    color: "inherit",
  }),
  highlight: ({ theme }) => ({
    background: theme.palette.grey['200']
  }),
})
const EmoneyDatePicker = ({
  dispatch,
  theme,
  value,
  onChange,
  adId,
  adDefaultMessage,
  placeholderId,
  placeholderDefault,
  intl,
  userSetting,
  ...props
}) => {
  /**
   * DatePicker Text Field Component
   */
  const DatePickerTextField = React.useMemo(() => {
    return (textFieldProps) => {
      return (
        <AdormentTextField
          fullWidth
          placeholder={
            placeholderId &&
            intl.formatMessage({
              id: placeholderId,
              defaultMessage: placeholderDefault
            })
          }
          className="trans_filter_accordion_detail_from flex-grow-1"
          adormentText={
            adId && (
              <p className="m-0">
                <FormattedMessage
                  {...{
                    id: adId,
                    defaultMessage: adDefaultMessage
                  }}
                />
              </p>
            )
          }
          {...textFieldProps}
        />
      );
    };
  }, [intl, placeholderId, placeholderDefault, adId, adDefaultMessage]);

  const classes = useStyles({ theme });
  const renderDay = (date, selectedDate, dayInCurrentMonth) => {
    const isSelectedDay = isSameDay(value, date) && dayInCurrentMonth;
    const dayClassName = clsx(classes.day, {
      [classes.nonCurrentMonthDay]: !dayInCurrentMonth,
      [classes.highlight]: isSelectedDay
    });
    return (
      <IconButton className={dayClassName}>
        <span> {format(date, "d")} </span>
      </IconButton>
    );
  };
  
  return (
    <KeyboardDatePicker
      {...props}
      TextFieldComponent={DatePickerTextField} // This is essential not () => <DatePickerTextField />
      value={value}
      onChange={onChange}
      format={DATE_FORMAT_TYPES[userSetting?.dateformat || 'mdy']}
      variant="inline"
      renderDay={renderDay}
    />
  );
};

EmoneyDatePicker.propTypes = {
  // Date Object
  value: PropTypes.object,
  // onChange Handler
  onChange: PropTypes.func.isRequired,
  adId: PropTypes.string,
  adDefaultMessage: PropTypes.string,
  placeholderId: PropTypes.string,
  placeholderDefault: PropTypes.string
};
const state = createStructuredSelector({
  userSetting: getUserSetting
});

export default withTheme(connect(state)(injectIntl(withMemo(EmoneyDatePicker))));

