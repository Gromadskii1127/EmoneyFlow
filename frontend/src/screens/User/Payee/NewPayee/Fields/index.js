import { useState, useCallback, useEffect } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { useHistory } from 'react-router-dom';
import { Box, Grid } from '@material-ui/core';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import * as PayeeActions from 'redux/actions/PayeeActions';
import * as AddPayeeActions from 'redux/actions/AddPayeeActions';
import { injectIntl } from 'react-intl';
import { getUserData } from 'redux/selectors/AddPayeeSelector';
import PayeeForm from '../../../components/PayeeForm';
import { LoadingButton } from 'components';


const Fields = ({
  path,
  submitted,
  dispatch,
  intl,
  children,
  prevRoute,
  pathes,
  currentPathIndex,
  pathData,
  ...props
}) => {
  const [value, setValue] = useState({});
  const [canContinue, setCanContinue] = useState(false);
  const history = useHistory();
  const isValid = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const onChange = (newValue) => {
    setValue(newValue);
  };
  const onStateChange = (valid) => {
    isValid.current = valid;

    setCanContinue(valid);
  };
  const handleClickNext = useCallback((event) => {
    const nextRoute = pathes[currentPathIndex + 1];
    if (canContinue) {
      setIsLoading(true);
      dispatch(
        AddPayeeActions.saveData(path, {
          data: value,
          isLoading: true,
          canContinue: true
        })
      );
      dispatch(PayeeActions.savePayee([value])).then(response => {
        setIsLoading(false);
        var v = {};
        if (response?.payload?.status === 200) {
          v = {};
          history.push(nextRoute);
        } else {
          v = value;
        }
        dispatch(
          AddPayeeActions.saveData(path, {
            data: v,
            canContinue: false,
            isLoading: false
          })
        );
      });

    } else {
      setIsSubmitted(true);
    }
  }, [pathes, currentPathIndex, history, path, dispatch, value, canContinue]);

  useEffect(() => {
    setValue(pathData[path]?.data || {})
    setIsLoading(pathData[path]?.isLoading || false);
    setCanContinue(pathData[path]?.canContinue || false);
  }, [pathData, path])
  return (
    <Box>
      <Box>
        <PayeeForm
          value={value}
          onChange={onChange}
          onStateChange={onStateChange}
          submitted={isSubmitted}>
        </PayeeForm>
      </Box>
      <Box m={2}>
        <Grid container spacing={6} direction="row-reverse">
          <Grid item>
            <LoadingButton
              disabled={isLoading}
              isLoading={isLoading}
              onClick={handleClickNext}
              endIcon={<ChevronRightIcon />}>
              {intl.formatMessage({
                id: 'next'
              })}
            </LoadingButton>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

const state = createStructuredSelector({
  pathData: getUserData
});
export default connect(state)(injectIntl(Fields));
