import React from 'react';
import PropTypes from 'prop-types';
import { Typography as MaterialTypography, useTheme } from '@material-ui/core';
import styled from 'styled-components';
import { AVAILABLE_TEXT_COLORS } from 'constant';

const TypographyContainer = styled(MaterialTypography)`
  color: ${(props) => props.textcolor};
  font-style: ${(props) => (props.italic === 'true' ? 'italic' : 'unset')};
  text-decoration: ${(props) => props.underline === 'true' ? 'underline' : 'none'};
`;

const Typography = ({
  children,
  color = 'primary',
  italic = false,
  underline = false,
  ...props
}) => {
  // use themes
  const theme = useTheme();

  return (
    <TypographyContainer
      italic={italic.toString()}
      underline={underline.toString()}
      textcolor={theme.palette.text[color]} // this should be lowercase if not, browser warnings.
      {...props}>
      {children}
    </TypographyContainer>
  );
};

Typography.propTypes = {
  color: PropTypes.oneOf(AVAILABLE_TEXT_COLORS), // colors that this component supports
  italic: PropTypes.bool // italic
};
export default Typography;
