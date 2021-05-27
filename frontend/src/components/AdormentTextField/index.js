import React, { useState, useCallback, useEffect, useRef } from 'react';
import { injectIntl } from 'react-intl';
import { withMemo } from 'components/HOC';
import { TextField, InputAdornment } from '@material-ui/core';
import { Required } from './validators';

const AdormentTextField = ({
  adormentText,
  endAdornment,
  validator,
  submitted,
  onValidated,
  intl,
  ...props
}) => {
  const [validationError, setValidationError] = useState();
  const validatorRef = useRef(validator);

  // if the input is required add the required placeholder
  // also add the required validator
  if (props.required) {
    props.placeholder = props.placeholder ?  props.placeholder : intl.formatMessage({ id: 'required' });
    validatorRef.current = validator
      ? (value) => Required(value) || validator(value)
      : Required;
  }

  // run validator fn which checks the validator each value change
  // sets the validators result (string) as the validationError
  const runValidator = useCallback(
    ({ target: { value } }) => {
      if (!validatorRef.current) {
        return;
      }
      const validationResult = validatorRef.current(value);
      onValidated && onValidated(validationResult);

      if (!submitted) {
        return;
      }
      setValidationError(validationResult);
    },
    [setValidationError, validatorRef, submitted, onValidated]
  );

  // hooks the run validator function into the onChange callback
  const onChange = props.onChange;
  props.onChange = onChange
    ? (event) => {
        onChange(event);
        runValidator(event);
      }
    : runValidator;

  // runs it once at start
  useEffect(() => {
    runValidator({ target: props });
  }, [runValidator, props]);

  return (
    <TextField
      error={!!validationError}
      helperText={
        validationError && intl.formatMessage({ id: validationError })
      }
      InputProps={{
        startAdornment: (
          <InputAdornment
            classes={{
              positionStart: 'andorment-start'
            }}
            position="start">
            {adormentText || ''}
          </InputAdornment>
        ),
        endAdornment: (
          <InputAdornment
            classes={{
              positionEnd: 'andorment-end'
            }}
            position="end">
            {endAdornment || ''}
          </InputAdornment>
        ),
        ...(props.InputProps || {})
      }}
      {...props}
    />
  );
};

export default injectIntl(withMemo(AdormentTextField));
