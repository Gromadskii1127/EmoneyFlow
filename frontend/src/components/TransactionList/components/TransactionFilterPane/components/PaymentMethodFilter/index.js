import React from 'react';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
// constants
import getButtons from './buttons';
// Components
import EmoneyToggleBtnGroup from 'components/EmoneyToggleBtnGroup';

const PaymentMethodFilter = ({ intl, onChange }) => {
  const buttons = React.useMemo(() => getButtons(intl), [intl]);

  return <EmoneyToggleBtnGroup onChange={onChange} buttons={buttons} />;
};

PaymentMethodFilter.propTypes = {
  /**
   * Handler when toggle option selected. whole button object will return
   */
  onChange: PropTypes.func.isRequired
};
export default injectIntl(PaymentMethodFilter);
