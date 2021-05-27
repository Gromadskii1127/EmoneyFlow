import React from 'react';
import { Box } from '@material-ui/core';
import { styled } from '@material-ui/core/styles';

import PropTypes from 'prop-types';

const DashboardContainer = styled(Box)({
  paddingBottom: 50
});

const DashboardSection = (props) => {
  const { children } = props;
  return (
    <DashboardContainer component="section">{children}</DashboardContainer>
  );
};

DashboardSection.propTypes = {
  children: PropTypes.node
};

export default DashboardSection;
