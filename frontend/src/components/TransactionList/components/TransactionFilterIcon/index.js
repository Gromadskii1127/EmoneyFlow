import React from 'react';
import PropTypes from 'prop-types';
// Components
import { IconButton } from '@material-ui/core';

const TransactionFilterIcon = ({ onOpenFilter }) => {
  const [active, setActive] = React.useState(false);

  /**
   * Handler when open filter settings
   */
  const openFilter = React.useCallback(() => {
    onOpenFilter(!active);
    setActive((prev) => !prev);
  }, [active, onOpenFilter]);

  const activeClassName = active ? 'text-color-228fee' : 'text-color-7E84A3';
  return (
    <IconButton style={{width: 30, height: 30}} size="small" onClick={openFilter}>
      <span className={`emicon-filter ${activeClassName}`} />
    </IconButton>
  );
};

TransactionFilterIcon.propTypes = {
  // handler when open filter setting
  onOpenFilter: PropTypes.func.isRequired
};

export default TransactionFilterIcon;
