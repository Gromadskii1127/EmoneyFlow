import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
// Components
import { Button } from '@material-ui/core';

const StyledButton = styled(Button)`
  height: 18px;
  letter-spacing: 0px;
  font-weight: 500;
  font-size: 12px;
  min-width: 0;
  margin-right: 10px;
`;

const EmoneyToggleBtn = ({ onClick, activated, children }) => {
  const classes = React.useMemo(
    () => ({
      root: !activated
        ? 'trans-filter-toggle-button'
        : 'trans-filter-toggle-button-selected'
    }),
    [activated]
  );
  return (
    <StyledButton onClick={onClick} classes={classes} size="small">
      {children}
    </StyledButton>
  );
};

EmoneyToggleBtn.propTypes = {
  // OnClick Handler
  onClick: PropTypes.func.isRequired,
  // Identifies activated/inactivated button
  activated: PropTypes.bool.isRequired
};
export default EmoneyToggleBtn;
