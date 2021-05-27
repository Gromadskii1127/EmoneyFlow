import { useEffect } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { Box } from '@material-ui/core';
import { injectIntl } from 'react-intl';

import { getUserData } from 'redux/selectors/AddPayeeSelector';
import Success from '../../../components/Success';

const Complete = ({
  path,
  idPrefix,
  onCompleted,
  userData,
  dispatch,
  intl,
  children,
  exitUrl,
  ...props
}) => {
  useEffect(() => {

  }, []);

  return (
    <Box>
      <Success
        text={intl.formatMessage({ id: `success.${idPrefix}-${path}` })}
        exitText={intl.formatMessage({ id: `success.${idPrefix}-${path}.text` })}
        exitUrl={exitUrl}
      />
    </Box>
  );
};

const state = createStructuredSelector({
  userData: getUserData
});
export default connect(state)(injectIntl(Complete));
