import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { injectIntl } from 'react-intl';
import { Grid } from '@material-ui/core';
// components
import { TextField } from '@material-ui/core';
import Autocomplete, {
  createFilterOptions
} from '@material-ui/lab/Autocomplete';
import * as PayeeActions from 'redux/actions/PayeeActions';
import { withMemo } from 'components/HOC';
import { getPayeeList } from 'redux/selectors/PayeeSelector';
const filter = createFilterOptions();

const PayeeAutoComplete = ({
  dispatch,
  intl,
  onAddPayee,
  value: propsValue,
  onChange: onPropsChange,
  payeeList,
  submitted
}) => {  
  const [value, setValue] = useState(propsValue || null);
  const [isLoaded, setIsLoaded] = useState(false);
  /**
   * Handler when click add payee
   */

  const onAddPayeeAddClick = useCallback(
    (e) => {
      if (onAddPayee) {
        onAddPayee();
      } else {
        //history.push('/admin/company');
      }
    },
    [onAddPayee]
  );
  /**
   * Custom Render Option
   */
  const renderOption = useCallback(
    (option) => {
      if (option.type === 'add') {
        // Add Payee Option
        return (
          <div
            onClick={onAddPayeeAddClick}
            className="bg-f7f9fc w-100 p-2 d-flex flex-row justify-content-end align-items-center">
            <span className="emicon-user-plus pr-1"></span>{' '}
            {intl.formatMessage({
              id: 'user.payout.button.add.payee',
              defaultMessage: 'Add new Payee'
            })}
          </div>
        );
      }
      return (
        <Grid container spacing={2} className="pl-2 pt-2 pb-2">
          <Grid item md={4}>
            {option.affiliateId}
          </Grid>
          <Grid item md={7}>
            <span>{option.firstName }{' '}{ option.lastName}</span>
          </Grid>
        </Grid>
      );
    },
    [onAddPayeeAddClick, intl]
  );

  /**
   * Custom Render Input
   */
  const renderInput = useCallback((params) => {
    return <TextField {...params} placeholder={ intl.formatMessage({id: 'search.keyword.placeholder'})}/>;
  }, [intl]);

  /**
   * onChange event handler
   */
  const onChange = useCallback((event, newValue) => {
    // Ignore when select add company option.
    if (newValue && newValue.type === 'add') {
      return;
    }
    if (typeof newValue === 'string') {
      setValue({
        title: newValue
      });
    } else if (newValue && newValue.inputValue) {
      // Create a new value from the user input
      setValue({
        title: newValue.inputValue
      });
    } else {
      setValue(newValue);
    }
  }, []);

  /**
   * Handler when value has been changed
   */
  useEffect(() => {
    if (value && onPropsChange) {
      onPropsChange(value);
    }
  }, [onPropsChange, value]);

  useEffect(() => {
    if (!submitted && isLoaded){
      dispatch(PayeeActions.fetchPayeeList("", 0, 0));
      setIsLoaded(true);
    }
    
  }, [dispatch, submitted, isLoaded]);

  return (
    <Autocomplete
      value={value}
      classes={{
        option: 'custom-option',
        popper: 'custom-popper',
        listbox: 'custom-listbox',
        root: 'custom-auto-complete'
      }}
      onChange={onChange}
      filterOptions={(options, params) => {        
        const filtered = filter(options, params);

        // Suggest to create a company
        filtered.push({
          inputValue: params.inputValue,
          type: 'add'
        });
        return filtered;
      }}
      selectOnFocus
      clearOnBlur
      handleHomeEndKeys
      id="free-solo-with-text-demo"
      options={payeeList.list || []}
      getOptionLabel={(option) => {
        // Value selected with enter, right from the input
        if (typeof option === 'string') {
          return option;
        }
        // Add "xxx" option created dynamically
        if (option.inputValue) {
          return option.inputValue;
        }
        // Regular option
        return option.firstName + ' ' + option.lastName;
      }}
      renderOption={(option) => renderOption(option)}
      freeSolo
      renderInput={renderInput}
    />
  );
};

PayeeAutoComplete.propTypes = {
  // handler when click add company
  onAddPayee: PropTypes.func,
  // company value and setCompanyValue func
  value: PropTypes.object,
  // onChange Handler
  onChange: PropTypes.func
};

const state = createStructuredSelector({
  payeeList: getPayeeList
});
export default connect(state)(injectIntl(withMemo(PayeeAutoComplete)));
// TODO: Replace w/ company data of reducer.
