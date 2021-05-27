import { Box } from '@material-ui/core';
import { injectIntl } from 'react-intl';

import Success from '../../../components/Success';

const Complete = ({
  path,
  idPrefix,
  apiUrl,
  dispatch,
  intl,
  exitUrl,
  children,
  ...props
}) => {
  return (
    <Box>
      <Success
        text={intl.formatMessage({ id: `success.${idPrefix}-${path}` })}
        exitText={intl.formatMessage({ id: `success.${idPrefix}-${path}.text`})}
        exitUrl={exitUrl}
      />
    </Box>
  );
};

export default injectIntl(Complete);
