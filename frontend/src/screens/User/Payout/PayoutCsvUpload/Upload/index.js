import { useState, useCallback, useRef } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { Box, Grid, Button } from '@material-ui/core';
import { injectIntl, FormattedMessage } from 'react-intl';
import { csv } from 'csvtojson/browser/browser';

import { AdormentTextField } from 'components';
import { getUserData } from 'redux/selectors/PayoutUploadCsvSelector';
import * as PayoutUploadCsvActions from 'redux/actions/PayoutUploadCsvActions';

const Upload = ({submitted,  path, dispatch, intl, children, pathes, currentPathIndex, exitUrl , ...props }) => {

  const inputFile = useRef(null)
  const [file, setFile] = useState(props.userData?.[path]?.file);

  const saveFileContent = useCallback((file) => {
    return new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = function (event) {
        resolve(event.target.result);
      };
      reader.readAsText(file);
    }).then(fileText => {
      fileText = fileText.replace(/;/gm, ',');
      return csv().fromString(fileText)
    }).then(csvData => {
      console.log('csvData ', csvData);
      const newState = {
        csvData,
        file: {
          name: file.name
        },
        canContinue: !!csvData,
        isDisabled: !csvData
      };
      dispatch(PayoutUploadCsvActions.saveData(path, newState));
    });
  },[dispatch, path])

  const handleChangedFile = useCallback((event) => {
    if (!event.target.files || !event.target.files.length) {
      return;
    }
    const file = event.target.files[0];
    saveFileContent(file);
    setFile(file);
    
  }, [saveFileContent])
  const handleClickOpenFile = useCallback(() => {
    inputFile.current.click();
  }, [])
  return (
    <Box p={3}>
      <Grid container >
        <Grid item md={2} />
        <Grid item md={8} xs={12} container spacing={2} className="mt-3">
          <Grid item md={9} >
            <AdormentTextField
              fullWidth
              value={file?.name || ''}
              adormentText={
                <p className="m-0">
                  <FormattedMessage {... {
                    id: "user-upload-payout:",
                    defaultMessage: "CSV Upload:"
                  }} />
                </p>
              }
              className="trans_filter_accordion_detail_from flex-grow-1"
              submitted={submitted}
            />
          </Grid>
          <Grid item md={3}>
            <input type='file' id='file' ref={inputFile} style={{ display: 'none' }} accept=".csv" onChange={handleChangedFile}/>
            <Button variant="contained" color="primary" className="w-100" onClick={handleClickOpenFile}>{intl.formatMessage({ id: "emoney.file" })}</Button>
          </Grid>
        </Grid>
        <Grid item md={2} />
      </Grid>
    </Box>
  );
}

const state = createStructuredSelector({
  userData: getUserData
});
export default connect(state)(injectIntl(Upload));