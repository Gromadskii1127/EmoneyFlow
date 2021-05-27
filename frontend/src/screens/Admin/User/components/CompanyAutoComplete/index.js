import React , {useState, useCallback, useEffect} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { injectIntl } from 'react-intl';
import * as AdminCompanyActions from 'redux/actions/AdminCompanyActions';
import { useHistory } from 'react-router-dom';
// components
import { TextField } from '@material-ui/core';
import Autocomplete, {
  createFilterOptions
} from '@material-ui/lab/Autocomplete';
import { withMemo } from 'components/HOC';
import { getCompanyList } from 'redux/selectors/AdminCompanySelector'
const filter = createFilterOptions();

const CompanyAutoComplete = ({
  dispatch,
  intl,
  onAddCompany,
  value: propsValue,
  onChange: onPropsChange,
  companyList,
  onNewAdded
}) => {
  const [value, setValue] = useState(propsValue || null);
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();
  /**
   * Handler when click add company
   */
  const onAddCompanyAddClick = useCallback(
    (e) => {
      if (onAddCompany) {
        onAddCompany();
      }
      else
      {
        history.push('/admin/company');
      }
      
    },
    [onAddCompany, history]
  );
  /**
   * Custom Render Option
   */
  const renderOption = useCallback(
    (option) => {
      if (option.type === 'add') {
        // Add Company Option
        return (
          <div
            onClick={onAddCompanyAddClick}
            className="bg-f7f9fc w-100 p-2 d-flex flex-row justify-content-end align-items-center">
            <span className="emicon-company pr-1"></span> {intl.formatMessage({ id: "admin.user.table.edit.company.add", defaultMessage: "Add Company" })}
          </div>
        );
      }
      return <div className="p-2">{option.name}</div>;
    },
    [onAddCompanyAddClick, intl]
  );

  /**
   * Custom Render Input
   */
  const renderInput = useCallback((params) => {
    return <TextField {...params}  />;
  }, []);

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

  const fetchCompanyList = useCallback(() => {
    setIsLoading(true);
    dispatch(AdminCompanyActions.getCompanyList("", 0, 0)).then(response => {
      setIsLoading(false);
    });
  }, [dispatch])
  /**
   * Handler when value has been changed
   */
  useEffect(() => {
    if (value && onPropsChange) {
      onPropsChange(value);
    }
  }, [onPropsChange, value]);

  useEffect(() => {
    fetchCompanyList();
  }, [fetchCompanyList]);

  useEffect(() => {
    if (onNewAdded)
      fetchCompanyList();
  }, [onNewAdded, fetchCompanyList])
  return (
    <Autocomplete
      loading={true}
      loadingText={intl.formatMessage({id: "admin.user.autocomplete.loading"})}
      value={value}
      classes={{
        option: 'custom-option',
        popper: 'custom-popper',
        listbox: 'custom-listbox'
      }}
      onChange={onChange}
      filterOptions={(options, params) => {
        const filtered = filter(options, params);

        // Suggest to create a company
        if (!isLoading) {
          filtered.push({
            inputValue: params.inputValue,
            type: 'add'
          });
        }
        
        return filtered;
      }}
      selectOnFocus
      clearOnBlur
      handleHomeEndKeys
      id="free-solo-with-text-demo"
      options={companyList.list}
      getOptionLabel={(option) => {
        console.log('option = ', value)
        // Value selected with enter, right from the input
        if (option?.type === "add") {
          return value?.name || "";
        }
        if (typeof option === 'string') {
          return option;
        }
        // Add "xxx" option created dynamically
        if (option.inputValue) {
          return option.inputValue;
        }
        // Regular option
        return option.name;
      }}
      renderOption={(option) => renderOption(option)}
      freeSolo
      renderInput={renderInput}
    />
  );
};

CompanyAutoComplete.propTypes = {
  // handler when click add company
  onAddCompany: PropTypes.func,
  // company value and setCompanyValue func
  value: PropTypes.object,
  // onChange Handler
  onChange: PropTypes.func,
  onNewAdded: PropTypes.bool
};

const state = createStructuredSelector({
  companyList: getCompanyList,  
});
export default connect(state)(injectIntl(withMemo(CompanyAutoComplete)));
// TODO: Replace w/ company data of reducer.
