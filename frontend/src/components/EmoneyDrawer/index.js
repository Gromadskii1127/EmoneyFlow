import styled from 'styled-components';
import { Box, Grid, Drawer } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

import { injectIntl } from 'react-intl';

import { withMemo } from 'components/HOC';
import { ToolTipIconButton } from 'components/EmoneyButtons';

const LeftHeaderBox = styled(Box)`
  ${({ theme }) => {
    return `
      border-right: 1px solid ${theme.palette.grey['300']};
      display: flex;
      align-items: center;
    `;
  }}
`;

const EmoneyDrawer = ({
  isOpen,
  onClose,
  children,
  header,
  intl,
  ...props
}) => {
  return (
    <Drawer
      anchor="bottom"
      open={isOpen}
      onClose={onClose}
      transitionDuration={300}
      classes={{ paper: 'company-drawer-paper' }}>
      <div className="trans-drawer-container company-drawer-container">
        <div className="trans-drawer-content d-flex flex-column p-3">
          <Box>
            <Grid container justify="flex-end">
              <LeftHeaderBox pr={4}>{header}</LeftHeaderBox>

              <Box pl={2}>
                <ToolTipIconButton
                  icon={<CloseIcon fontSize="large" />}
                  onClick={onClose}
                  title={intl.formatMessage({
                    id: 'close'
                  })}></ToolTipIconButton>
              </Box>
            </Grid>
          </Box>

          <Box px={10} pb={5}>
            {children}
          </Box>
        </div>
      </div>
    </Drawer>
  );
};

export default injectIntl(withMemo(EmoneyDrawer));
