import React from 'react';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import getButtons from './buttons';
import EmoneyToggleBtnGroup from 'components/EmoneyToggleBtnGroup';

const CurrencyFilter = ({ intl, onChange }) => {
  const buttons = React.useMemo(() => getButtons(intl), [intl]);

  return <EmoneyToggleBtnGroup onChange={onChange} buttons={buttons} />;
};


CurrencyFilter.propTypes = {
  /**
   * Handler when toggle option selected. whole button object will return
   */
  onChange: PropTypes.func.isRequired
};
export default injectIntl(CurrencyFilter);
