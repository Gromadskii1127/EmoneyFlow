import {
  RadioGroup,
  FormControlLabel,
  Radio,
  Grid,
  Box
} from '@material-ui/core';
import { injectIntl } from 'react-intl';
import { LabelTypography } from '../../screens/User/components/helper';

const EmoneyRadioGroup = ({ label, items, intl, ...props }) => {
  const getStyle = (index) => {
    return items.length - 1 === index ? { marginRight: 0 } : {};
  };

  return (
    <Grid container direction="row" alignItems="center">
      {label && (
        <Box mr={3}>
          <LabelTypography>{label}</LabelTypography>
        </Box>
      )}

      <RadioGroup {...props} row>
        {items.map((item, index) => (
          <FormControlLabel
            key={item}
            value={item}
            control={<Radio color="primary" />}
            label={intl.formatMessage({
              id: `radio.${item}`
            })}
            classes={{ label: 'font-medium font-bold' }}
            style={{ marginBottom: 0, ...getStyle(index) }}
            labelPlacement="end"
          />
        ))}
      </RadioGroup>
    </Grid>
  );
};

export default injectIntl(EmoneyRadioGroup);
