import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useTheme } from '@material-ui/core';
import { AVAILABLE_COLORS } from 'constant';

const IconContainer = styled.span`
  font-size: ${(props) => props.size}px;
  color: ${(props) => props.color};
`;

const EMoneyIcon = ({ children, icon, size = 32, color = 'primary' }) => {
  const theme = useTheme();
  // return <img src={icons[icon]} alt="category-icon" />;
  return (
    <IconContainer
      className={icon}
      size={size}
      color={theme.palette.background[color]}>
      {children}
    </IconContainer>
  );
};

EMoneyIcon.propTypes = {
  icon: PropTypes.string.isRequired,
  size: PropTypes.number,
  color: PropTypes.oneOf(AVAILABLE_COLORS)
};
export default EMoneyIcon;
