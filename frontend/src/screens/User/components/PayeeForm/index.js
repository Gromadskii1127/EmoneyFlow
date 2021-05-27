import { useCallback, useRef } from 'react';

import { Box, Grid } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import Skeleton from '@material-ui/lab/Skeleton';
import { injectIntl } from 'react-intl';
import { keys, every } from 'lodash';

import { StaticFields, DynamicFields, PaymentMethodField } from './fields';

const LeftGrid = withStyles((theme) => ({
  root: {
    [theme.breakpoints.up('sm')]: {
      justifyContent: 'flex-end'
    }
  }
}))(Grid);

const RightGrid = withStyles((theme) => ({
  root: {
    [theme.breakpoints.up('sm')]: {
      justifyContent: 'flex-start'
    }
  }
}))(Grid);

const FieldsBox = withStyles((theme) => ({
  root: {
    [theme.breakpoints.up('sm')]: {
      maxWidth: 300
    },
    width: '100%'
  }
}))(Box);

const PayeeForm = ({
  value,
  onChange,
  onStateChange,
  submitted,
  dispatch,
  intl,
  ...props
}) => {
  const validationErros = useRef({});
  const dynamicFields = value?.method && DynamicFields[value.method];

  const isValid = useCallback(() => {
    return (
      dynamicFields &&
      keys(validationErros.current).length ===
        [...StaticFields, ...dynamicFields].length + 1 &&
      every(validationErros.current, (v) => !v)
    );
  }, [validationErros, dynamicFields]);
  const isValueValid = useRef(isValid(value));

  const setValue = (field) => ({ target: { value: fieldValue } }) => {
    const newValue = {
      ...value,
      [field]: fieldValue
    };
    onChange(newValue);
  };

  const onValidated = (field) => (validationError) => {
    validationErros.current[field] = validationError;

    if (isValueValid.current !== isValid()) {
      isValueValid.current = isValid();
      onStateChange(isValueValid.current);
    }
  };

  const getField = (field) =>
    value ? (
      <field.component
        key={field.name}
        style={{ width: '100%' }}
        value={value[field.name] === undefined ? '' : value[field.name]}
        adormentText={intl.formatMessage({ id: field?.id })}
        onChange={setValue(field.name)}
        required={field?.required}
        submitted={submitted}
        onValidated={onValidated(field.name)}
        className="mt-3"
      />
    ) : (
      <Skeleton key={field.name} style={{ height: 40 }} variant="text" />
    );

  return (
    <Grid container spacing={5}>
      <LeftGrid container item sm={6} xs={12}>
        <FieldsBox>
          <Box pt={1}>{StaticFields.map(getField)}</Box>
        </FieldsBox>
      </LeftGrid>

      <RightGrid container item sm={6} xs={12}>
        <FieldsBox>
          <Box pt={1}>{getField(PaymentMethodField)}</Box>
        </FieldsBox>
        <FieldsBox>
          <Box pt={1}>{dynamicFields && dynamicFields.map(getField)}</Box>
        </FieldsBox>
      </RightGrid>
    </Grid>
  );
};

export default injectIntl(PayeeForm);
