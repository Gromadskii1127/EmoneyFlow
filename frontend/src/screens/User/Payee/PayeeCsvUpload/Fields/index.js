import { useState, useCallback } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Link } from 'react-router-dom';
import { Box, Grid, Typography, Button } from '@material-ui/core';
import { withStyles, styled } from '@material-ui/core/styles';
import { injectIntl } from 'react-intl';
import { get, keys } from 'lodash';

import { getUserData } from 'redux/selectors/PayeeUploadCsvSelector';
import * as PayeeUploadCsvActions from 'redux/actions/PayeeUploadCsvActions';
import { EmoneySelect } from 'components';

const FieldsBox = withStyles((theme) => ({
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

const FileNameTitle = styled(Typography)({
  fontSize: '28px',
  fontWeight: '600',
  width: '100%',
  marginTop: '15px'
});
const Fields = ({
  fieldDefinitions,
  path,
  submitted,
  dispatch,
  intl,
  children,
  prevRoute,
  currentPathIndex,
  pathes,
  exitUrl,
  ...props
}) => {
  let [mapping, setMapping] = useState(props.userData?.[path]?.mapping || {});
  const isLastStep = pathes.length === currentPathIndex + 1;
  const nextRoute = !isLastStep
    ? pathes[currentPathIndex + 1]
    : exitUrl;
  const fileName = get(props, 'userData.upload.file.name');
  const csvKeys = keys(props.userData?.upload?.csvData?.[0]);

  const setValue = useCallback((id, value) => {
    const mt = {
      ...mapping,
      [id]: value
    };
    setMapping(mt);
    console.log('mapping = ', mt);
    dispatch(PayeeUploadCsvActions.saveData(path, {
      mapping: mt,
      canContinue: keys(mt).length >= fieldDefinitions.length
    }));

  }, [dispatch, mapping, path, fieldDefinitions]);

  return (
    <Grid container item justify="center">
      <FieldsBox>

        <FileNameTitle>
          {fileName}
        </FileNameTitle>

        <Box pt={1}>
          {fieldDefinitions.map(field => (
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
                      noneObject={{ value: "None", title: "None" }}
                      value={mapping[field.value] || ''}
                      // handleChange={(value) => setValue(field.value, value)}
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
};

const state = createStructuredSelector({
  userData: getUserData
});
export default connect(state)(injectIntl(Fields));