import React, { useState, useRef } from 'react';
import { injectIntl } from 'react-intl';
import { motion } from 'framer-motion';
import propTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
// components
import { withMemo } from 'components/HOC';
import { AdormentTextField, EmoneyIcon } from 'components';

const variants = {
  open: { width: '100%' },
  closed: { width: '120px' }
};

const useStyles = makeStyles((theme) => ({
  textFieldActive: {
    '&::before': {
      borderBottom: '0 !important'
    }
  }
}));

const TransactionSearchFilter = ({ intl, onSearchTextChange }) => {
  const [open, setOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const containerRef = useRef(null);

  /**
   * OnClick Handler
   */
  const onClick = React.useCallback(() => {
    // TextField Transition start
    setOpen(true);
  }, []);

  /**
   * OnBlur Handler
   */
  const onBlur = React.useCallback(() => {
    setOpen(false);
  }, []);

  const onKeyUp = React.useCallback((event) => {
    // Invoke parent's onSearchTextChange handler    
    if (event.key === 'Enter') {
      if (onSearchTextChange) onSearchTextChange(searchText);
    }
    
  }, [onSearchTextChange, searchText]);
  const classes = useStyles();
  return (
    <motion.div
      ref={containerRef}
      animate={open ? 'open' : 'closed'}
      variants={variants}>
      <AdormentTextField
        fullWidth
        placeholder={intl.formatMessage({
          id: 'search.keyword.placeholder',
          defaultMessage: 'Search...'
        })}
        InputProps={{
          classes: {
            root: classes.textFieldActive
          }
        }}
        adormentText={<EmoneyIcon icon="emicon-search" size={17} />}
        value={searchText}
        onClick={onClick}
        onChange={(e) => setSearchText(e.target.value)}
        onBlur={onBlur}
        onKeyUp={onKeyUp}
      />
    </motion.div>
  );
};

TransactionSearchFilter.propTypes = {
  // Handler when user focus out of search text field
  onSearchTextChange: propTypes.func.isRequired
};

export default injectIntl(withMemo(TransactionSearchFilter));
