import React from 'react';
// components
import { Typography } from '@material-ui/core';
import { withMemo } from 'components/HOC';

const PageTitleTypography = ({ children }) => {
  return <Typography variant="h6">{children}</Typography>;
};

export default withMemo(PageTitleTypography);
