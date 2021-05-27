import { Tooltip, Box } from '@material-ui/core';
import { isUndefined } from 'lodash';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { getUserSetting } from 'redux/selectors/UserSelector';
import EmoneyFormattedNumber from './index';

const EmoneyFormattedNumberWithStatus = ({ intl, color, name, styleType, currency, amount, userSetting }) => {
  return (
    <div className="d-flex flewx-row justify-contente-left align-items-center">
      <Tooltip
        classes={{
          tooltip: 'trans-drawer-button-tooltip',
          arrow: 'trans-drawer-button-arrow'
        }}
        arrow
        title={intl.formatMessage({
          id: name
        })}
        placement="top">
        <div className="d-flex flex-row justify-content-left align-items-center">
          <div
            className="trans-status"
            style={{ backgroundColor: color }}
          />
          {!isUndefined(amount) && (
            <Box ml={0.5}>
              <span>(</span>
              <EmoneyFormattedNumber
                styleType="currency"
                currency={currency || 'EUR'}
                number={amount || 0}
              />
              <span>)</span>
            </Box>
          )}
        </div>
      </Tooltip>
    </div>
  )
}
const state = createStructuredSelector({
  userSetting: getUserSetting
});
export default connect(state)(injectIntl(EmoneyFormattedNumberWithStatus))