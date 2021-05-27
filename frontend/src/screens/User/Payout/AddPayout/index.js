import { Box, Grid} from '@material-ui/core';
import {injectIntl } from 'react-intl';

import { withMemo } from 'components/HOC';
import { UppercasedTypography } from './../../components/helper';
import OptionPaperLinks from './../../components/OptionPaper/links';
import Links from './links';

const AddPayout = ({ intl, ...props }) => {
  return (
    <Grid container item direction="column" alignItems="center">
      <UppercasedTypography>
        {intl.formatMessage({id: 'user.add.payout' })}
      </UppercasedTypography>

      <Box mt={3}>
        <OptionPaperLinks links={Links}></OptionPaperLinks>
      </Box>
    </Grid>
  );
}

export default injectIntl(withMemo(AddPayout));