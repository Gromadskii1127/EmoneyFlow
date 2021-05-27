import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { Typography } from '@material-ui/core';
import { SuccessTextTypography, SuccessIcon, SuccessBar } from './styled-components';

const Success = ({ text, exitUrl, exitText }) => {
  return (
    <Grid
      container
      direction="column"
      justify="center"
      alignItems="center"
      spacing={6}
      className="my-5 mb-4">
      <Grid item>
        <SuccessIcon className="emicon-checkmark-circle" />
      </Grid>
      <Grid style={{ marginTop: -20 }} item>
        <SuccessBar />
      </Grid>
      <Grid item>
        <SuccessTextTypography color="textSecondary">
          {text}
        </SuccessTextTypography>
      </Grid>
      {exitText && (
        <Grid item>
          <Link to={exitUrl}>
            <Typography variant="h6" color="textSecondary">
              <span className="emicon-payouts"></span> {exitText}
            </Typography>
          </Link>
        </Grid>
      )}
    </Grid>
  );
};

Success.propTypes = {
  // Success Text
  text: PropTypes.string.isRequired,
  // redirect url when click make new progress
  exitUrl: PropTypes.string,
  // redirect url text
  exitText: PropTypes.string
};
export default Success;
