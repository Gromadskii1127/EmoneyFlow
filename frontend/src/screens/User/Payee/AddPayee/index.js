import { Box, Grid } from '@material-ui/core';
import { injectIntl } from 'react-intl';

import { withMemo } from 'components/HOC';
import { TitleTypography } from '../../components/helper';
import OptionPaperLinks from '../../components/OptionPaper/links';
import Links from './links';

const AddPayee = ({ intl, ...props }) => {
  return (
    <Grid container item direction="column" alignItems="center">
      <TitleTypography>
        {intl.formatMessage({ id: 'add-payee' })}
      </TitleTypography>

      <Box mt={3}>
        <OptionPaperLinks links={Links}></OptionPaperLinks>
      </Box>
    </Grid>
  );
};

export default injectIntl(withMemo(AddPayee));
