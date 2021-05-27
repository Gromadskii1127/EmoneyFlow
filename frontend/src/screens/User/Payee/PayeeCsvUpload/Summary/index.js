import { useState, useCallback, useEffect } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Link } from 'react-router-dom';
import { Box, Grid, Button } from '@material-ui/core';
import { injectIntl } from 'react-intl';
import { transform, map } from 'lodash';
import { styled } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';

import { getUserData } from 'redux/selectors/PayeeUploadCsvSelector';
import * as PayeeActions from 'redux/actions/PayeeActions';
import * as PayeeUploadCsvActions from 'redux/actions/PayeeUploadCsvActions';
import { EmoneyTable } from 'components';
import { LoadingButton } from 'components';
import PayeeColumns from './columns';

const CancelButton = styled(Button)({
  backgroundColor: '#D3D3D3'
});
const Summary = ({ path, dispatch, intl, children, pathes, currentPathIndex, exitUrl, ...props }) => {
  const isLastStep = pathes.length === currentPathIndex + 1;
  const nextRoute = !isLastStep
    ? pathes[currentPathIndex + 1]
    : exitUrl;
  const prevRoute = currentPathIndex > 0 && pathes[currentPathIndex - 1];

  const mappings = props.userData.fields?.mapping || {};
  const data = map(props.userData.upload?.csvData, i => transform(i, (r, v, k) => {
    Object.keys(mappings).forEach((key, index) => {
      const value = mappings[key];
      if (value === k) {
        r[key] = v;
      }
    })
  }, {}));

  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const handleOnClickImport = useCallback((event) => {
    setIsLoading(true);
    dispatch(
      PayeeUploadCsvActions.saveData(path, {
        data: data,        
        isLoading: true
      })
    );
    dispatch(PayeeActions.savePayee(data)).then(response => {
      setIsLoading(false);
      var v = data;
      if (response?.payload?.status === 200) {
        v = {};        
        history.push(nextRoute);
      }
      dispatch(
        PayeeUploadCsvActions.saveData(path, {
          data: v,        
          isLoading: false
        })
      );
    });
  }, [dispatch, history, nextRoute, data, path]);

  useEffect(() => {  
    setIsLoading(props.userData[path]?.isLoading || false);
  }, [props.userData, path])
  return (
    <Box>
      <EmoneyTable
        data={data}
        columns={PayeeColumns(intl)} />
      <Box mt={3}>
        <Grid container direction="row-reverse" spacing={3}>
          <Grid item>
            <LoadingButton
              disabled={isLoading}
              isLoading={isLoading}
              variant="contained"
              onClick={handleOnClickImport}
              color="primary">
              {intl.formatMessage({ id: "emoney.continue.import" })}
            </LoadingButton>
          </Grid>
          <Grid item>
            <Link to={prevRoute}>
              <CancelButton
                variant="contained">
                {intl.formatMessage({ id: "emoney.cancel" })}
              </CancelButton>
            </Link>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

const state = createStructuredSelector({
  userData: getUserData
});
export default connect(state)(injectIntl(Summary));
