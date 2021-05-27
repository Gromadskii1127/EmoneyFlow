import { Typography } from '@material-ui/core';
import { styled } from '@material-ui/core/styles';

export const BoldTypography = styled(Typography)({
  fontWeight: 'bold'
});

export const LabelTypography = styled(BoldTypography)({});

export const UppercasedTypography = styled(BoldTypography)({
  textTransform: 'uppercase'
});

export const TitleTypography = styled(UppercasedTypography)({
  textTransform: 'uppercase'
});
