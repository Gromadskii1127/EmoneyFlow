import { BoldTypography } from '../helper';
import styled from 'styled-components';

export const SuccessTextTypography = styled(BoldTypography)`
  font-size: 20px;
  color: #05243f80;
  font-family: 'Inter', sans-serif;
  font-weight: 600 !important;
`;

export const SuccessIcon = styled.span`
  font-size: 60px;
  color: #22eec1;
`;

export const SuccessBar = styled.div`
  width: 400px;
  height: 4px;
  background: transparent linear-gradient(270deg, #22eec1 0%, #228fee 100%) 0%
    0% no-repeat padding-box;
  box-shadow: 6px 6px 6px #00000029;
  opacity: 1;
`;
