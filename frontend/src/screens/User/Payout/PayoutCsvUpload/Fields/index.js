import { useState, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Link } from 'react-router-dom';
import {
  Box,
  Grid,
  Typography,
  Button
} from '@material-ui/core';
import { withStyles, styled } from '@material-ui/core/styles';
import { injectIntl } from 'react-intl';
import { keys } from 'lodash';

import { getUserData } from 'redux/selectors/PayoutUploadCsvSelector';
import * as PayoutUploadCsvActions from 'redux/actions/PayoutUploadCsvActions';
import { EmoneySelect } from 'components';

import FieldDefinitions from './fields';

const FieldsBox = withStyles(theme => ({
  root: {
    maxWidth: 500,
    width: '100%'
  }
}))(Box);

const TitleBox = withStyles(theme => ({
  root: {
    height: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  }
}))(Box)

const MatchButton = styled(Button)({
  width: '100%'
})

const Fields = ({ path, submitted, dispatch, intl, children, currentPathIndex, pathes, exitUrl, ...props }) => {
  const isLastStep = pathes.length === currentPathIndex + 1;
  const nextRoute = !isLastStep
    ? pathes[currentPathIndex + 1]
    : exitUrl;
  let [mapping, setMapping] = useState(props.userData?.[path]?.mapping || {});
  const [csvKeys, setCsvKeys] = useState([]);
  
  const setValue = useCallback((id, value) => {
    const mt = {
      ...mapping,
      [id]: value
    };
    setMapping(mt);
    console.log('props userData = mapping ', mt)
    dispatch(PayoutUploadCsvActions.saveData(path, {
      mapping: mt,
      canContinue: keys(mt).length === FieldDefinitions.length
    }));

  }, [dispatch, mapping, path]);

  useEffect( () => {    
    setCsvKeys(keys(props.userData?.upload?.csvData?.[0]));
    console.log('props userData = fields', props.userData);
  }, [props.userData])
  return (
    <Grid container item justify="center">
      <FieldsBox>
        <Box pt={3}>
          {FieldDefinitions.map(field => (
            <Box key={field.id} mt={2}>
              <Grid container spacing={1}>
                <Grid item md={5} xs={false}>
                  <TitleBox>
                    <Typography className="font-medium font-semi-bold ">
                      {intl.formatMessage({ id: field.id })}
                    </Typography>
                  </TitleBox>
                </Grid>
                <Grid item container alignItems="center" xs={12} md={7}>
                  <Grid item xs={12}>
                    <EmoneySelect
                      dontNeedAdorment={true}
                      onNoneValue={true}
                      noneObject={{value: "None", title: "None"}}
                      value={mapping[field.value] || ''}
                      //handleChange={(value) => setValue(field.value, value)}
                      onChange={(event) => setValue(field.value, event.target.value)}
                      dontTranslate={true}
                      menuItems={csvKeys}
                      required={true}
                      submitted={submitted} />
                  </Grid>
                </Grid>
              </Grid>
            </Box>
          ))}
          <Grid container direction="row-reverse" className="mt-5">
            <Grid item xs={12} md={3}>
              <Link to={location => props.userData?.[path]?.canContinue === true ? nextRoute : `${location.pathname}?submitted=true`}>
                <MatchButton variant="contained" color="primary">{intl.formatMessage({ id: "upload-payout.fields.button.match" })}</MatchButton>
              </Link>
            </Grid>
          </Grid>
        </Box>
      </FieldsBox>
    </Grid>
  );
}

const state = createStructuredSelector({
  userData: getUserData
});
export default connect(state)(injectIntl(Fields));