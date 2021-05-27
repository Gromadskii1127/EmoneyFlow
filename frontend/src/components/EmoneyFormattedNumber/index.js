import { Fragment } from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { getUserSetting } from 'redux/selectors/UserSelector';

const EmoneyFormattedNumber = ({intl, styleType, currency, number, userSetting}) => {
  const numberFormat = userSetting?.xyformat || 1;
  const option = styleType === 'currency' ? { style: 'currency', currency: currency } : {}
  const numberFormatLocale = numberFormat === 1 ? 'ja-JP' : 'en-IN';
  return (
    <Fragment>
      {new Intl.NumberFormat(numberFormatLocale, option).format(number)}
    </Fragment>
  )
}
const state = createStructuredSelector({
  userSetting: getUserSetting
});
export default connect(state)(injectIntl(EmoneyFormattedNumber))