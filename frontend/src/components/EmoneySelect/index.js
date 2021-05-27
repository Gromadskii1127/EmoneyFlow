import React from 'react';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import { MenuItem, InputAdornment } from '@material-ui/core';
import { injectIntl } from 'react-intl';

//Project Components
import { withMemo } from 'components/HOC';
import { AdormentTextField } from 'components';
import { currencyValues, methodValues } from '../../constant';

const EmoneySelect = ({
  handleChange,
  menuItems,
  intl,
  adormentText,
  dontTranslate,
  InputProps,
  noneObject,
  onNoneValue,
  dontNeedAdorment,
  ...props
}) => {
  return (
    <AdormentTextField
      id="select"
      select
      className="emoneyselect"
      SelectProps={{
        IconComponent: () => (
          <KeyboardArrowDownIcon className="ml-1" fontSize="small" />
        )
      }}
      InputProps={{
        startAdornment: !dontNeedAdorment && (
          <InputAdornment
            classes={{
              positionStart: 'andorment-start'
            }}
            position="start">
            {adormentText || ''}
          </InputAdornment>
        ),
        ...(props.InputProps || {})
      }}
      {...props}
      >
      {menuItems.map((item, index) => {
        return (
          <MenuItem value={item} key={index}>
            {dontTranslate ? item : intl.formatMessage({ id: item })}
          </MenuItem>
        );
      })}
    </AdormentTextField>
  );
};
export default injectIntl(withMemo(EmoneySelect));

export const PaymentMethodSelect = injectIntl(  
  withMemo((props) => (
    <EmoneySelect
      {...props}      
      menuItems={methodValues.map((v) => v.value)}
    />
  ))
);

export const CurrencySelect = injectIntl(
  withMemo((props) => (
    <EmoneySelect
      {...props}      
      menuItems={currencyValues.map((v) => v.value)}
      dontTranslate={true}
    />
  ))
);
