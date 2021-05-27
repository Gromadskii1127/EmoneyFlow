import { useEffect } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { Box } from '@material-ui/core';
import { injectIntl } from 'react-intl';

import { getUserData } from 'redux/selectors/PayeeUploadCsvSelector';
import * as PayeeUploadCsvActions from 'redux/actions/PayeeUploadCsvActions';

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
    async function finish() {
      dispatch(
        PayeeUploadCsvActions.saveData(path, {
          isLoading: true,
          canContinue: false
        })
      );
      if (onCompleted)
        await dispatch(onCompleted(userData));
      dispatch(PayeeUploadCsvActions.finish());
    }

    if (
      userData[path] &&
      !userData[path].isLoading &&
      !userData[path].canContinue
    ) {
      dispatch(PayeeUploadCsvActions.finish());
      return;
    }

    if (!userData[path]) {
      finish();
    }
  }, [dispatch, onCompleted, path, userData]);

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

const state = createStructuredSelector({
  userData: getUserData
});
export default connect(state)(injectIntl(Complete));
