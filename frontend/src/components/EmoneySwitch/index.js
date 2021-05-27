import React from 'react';
import CheckOutlinedIcon from '@material-ui/icons/CheckOutlined';
import {
  Switch
} from '@material-ui/core';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect'
import { withMemo } from 'components/HOC';
const EmoneySwitch = ({ onChange, checked, props }) => {    
  return (
    <Switch
    {...props}
      onChange={onChange}
      checked={checked} 
      classes={{ root: "emoney-switch", track: "emoney-switch-track" }}
      checkedIcon={<span className="MuiSwitch-thumb d-flex justify-content-cent align-items-cent">
        <CheckOutlinedIcon fontSize="small" className="emoney-switch-checked-icon" />
      </span>} />
  );
};
const state = createStructuredSelector({});
export default connect(state)(withMemo(EmoneySwitch));