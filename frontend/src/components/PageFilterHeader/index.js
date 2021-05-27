import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { Box, Grid } from '@material-ui/core';
import { PageTitleTypography, SearchFilter } from 'components';

const PageFilterHeader = ({
  intl,
  pageTitleId,
  onSearchTextChange,
  customButton,
  customPane
}) => {
  return (
    <Box mb={1}>
      <Grid container direction="row">
        <Grid item xs={12} md={5}>
          <PageTitleTypography>
            {intl.formatMessage({
              id: pageTitleId
            })}
          </PageTitleTypography>
        </Grid>

        <Grid item xs={12} md={7}>
          <Box
            flex={1}
            display="flex"
            flexDirection="row"
            justifyContent="flex-end">            
            <Box
              width="100%"
              display="flex"
              flexDirection="row"
              justifyContent="flex-end">
              <SearchFilter onSearchTextChange={onSearchTextChange} />
            </Box>
            {customButton}
          </Box>
          {customPane}
        </Grid>
      </Grid>
    </Box>
  );
};

PageFilterHeader.propTypes = {
  pageTitleId: PropTypes.string.isRequired,
  onSearchTextChange: PropTypes.func.isRequired,
  customButton: PropTypes.node,
  customPane: PropTypes.node
};
export default injectIntl(PageFilterHeader);
