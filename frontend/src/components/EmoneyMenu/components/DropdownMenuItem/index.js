import React from 'react';
import { MenuItem, Typography } from '@material-ui/core';
// Project Structure
import { withMemo } from 'components/HOC';
const DropdownMenuItem = ({ text, icon, ...props }) => {
  return (
    <MenuItem {...props}>
      <span style={{ fontSize: '12px' }} className={icon} />
      <Typography variant="caption" className="ml-2">
        {text}
      </Typography>
    </MenuItem>
  );
};

export default withMemo(DropdownMenuItem);
