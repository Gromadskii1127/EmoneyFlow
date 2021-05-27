import React, { Fragment } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Stepper,
  Step,
  StepLabel,
  StepConnector,
  Button,
} from '@material-ui/core';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { injectIntl } from 'react-intl';
import { Link, withRouter } from 'react-router-dom';
import { map, last, slice } from 'lodash';
import clsx from 'clsx';

import { withMemo } from 'components/HOC';

import { TitleTypography } from '../helper';
import BackLink from '../BackLink';
import { LoadingButton } from 'components';

const LayoutStepper = withStyles((theme) => ({
  root: {
    background: 'transparent',
    [theme.breakpoints.up('sm')]: {
      marginLeft: 100,
      marginRight: 100
    }
  }
}))(Stepper);

const LayoutSteppConnector = withStyles((theme) => ({
  alternativeLabel: {
    top: 10,
    left: "calc(-50% + 8px)",
    right: "calc(50% + 8px)"
  },

  line: {
    height: 3,
    border: 0,
    backgroundColor: "#22EEC1",
    borderRadius: 1
  }
}))(StepConnector);

const useStepperIconStyle = makeStyles({
  root: {
    color: "white",
    display: "flex",
    height: 22,
    alignItems: "center"
  },
  active: {
    color: "#22EEC1"
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: "50%",
    backgroundColor: "currentColor",
    border: '3px solid #22EEC1'
  },

  completed: {
    color: "#22EEC1",
    width: 20,
    height: 20,
    borderRadius: "50%",
    backgroundColor: "currentColor",
    zIndex: 1,
  }
});
const LayoutStepIcon = (props) => {
  const classes = useStepperIconStyle();
  const { active, completed } = props;
  return (
    <div
      className={clsx(classes.root, {
        [classes.active]: active
      })}
    >
      {completed ? (
        <div className={classes.completed} />
      ) : (
          <div className={classes.circle} />
        )}
    </div>
  );
}
const useStyle = makeStyles((theme) => ({
  backLinkBox: {
    [theme.breakpoints.up('sm')]: {
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)'
    },
    [theme.breakpoints.only('xs')]: {
      marginTop: theme.spacing(2)
    }
  },
  hiddenBox: {
    visibility: 'hidden',
    [theme.breakpoints.only('xs')]: {
      display: 'none'
    }
  }
}));

const Layout = ({
  id,
  exitUrl,
  exitId,
  finishUrl,
  pathes,  
  currentPathIndex,
  hideStepper,
  userData,
  intl,
  children,
  option,  
  excludeStepCount,
  ...props
}) => {
  const classes = useStyle();

  const isLastStep = pathes.length === currentPathIndex + 1;
  const nextRoute = !isLastStep ? pathes[currentPathIndex + 1] : finishUrl;
  const prevRoute = currentPathIndex > 0 && pathes[currentPathIndex - 1];
  const steps = map(pathes, (p) => last(p.split('/')));
  const stepperSteps = slice(steps, 0, excludeStepCount ? -excludeStepCount : -1);
  const currentData = userData[steps[currentPathIndex]];
  const showNext = !!nextRoute;
  const showPrev = !!prevRoute && steps[currentPathIndex] !== 'complete';

  const LayoutContent = withMemo(() => {
    return (
      <Fragment>
        <Box px={3} pt={3}>
          <Grid container item direction="column" alignItems="center">
            {option.showTitle !== false && (
              <Typography variant="h4" className="font-x-big font-semi-bold">
                {intl.formatMessage({
                  id: `${id}.${steps[currentPathIndex]}`
                })}
              </Typography>
            )}
            {option.showTitle !== false && (
              <Typography className="text-color-666666 font-x-medium">
                {intl.formatMessage({
                  id: `${id}.${steps[currentPathIndex]}.description`
                })}
              </Typography>
            )}
          </Grid>
        </Box>

        <Box>{children}</Box>

        {(showNext || showPrev) && (
          <Box>
            <Box p={3}>
              <Grid container item justify="space-between">
                {showPrev && !option?.notShowPrev ? (
                  <Link to={prevRoute}>
                    <Button startIcon={<ChevronLeftIcon />}>
                      {intl.formatMessage({ id: 'prev' })}
                    </Button>
                  </Link>
                ) : (
                    <div></div>
                  )}

                {showNext && !option?.notShowNext && (
                  <Link to={location => currentData?.canContinue ? nextRoute : `${location.pathname}?submitted=true`}>
                    <LoadingButton
                      disabled={currentData?.isDisabled}
                      isLoading={currentData?.isLoading}                      
                      endIcon={<ChevronRightIcon />}>
                      {intl.formatMessage({
                        id: option?.buttonTextId ? option.buttonTextId : isLastStep ? 'finish' : 'next'
                      })}
                    </LoadingButton>
                  </Link>
                )}
              </Grid>
            </Box>
          </Box>
        )}
      </Fragment>)
  });

  return (
    <Grid style={{ marginTop: '-50px' }} container item direction="column">
      <Box mb={2}>
        <Grid style={{ position: 'relative' }}>
          <Box className={classes.backLinkBox}>
            <BackLink
              url={exitUrl}
              text={intl.formatMessage({ id: exitId })}
            />
          </Box>

          <Box className={hideStepper && classes.hiddenBox}>
            <LayoutStepper activeStep={currentPathIndex} alternativeLabel connector={<LayoutSteppConnector />}>
              {stepperSteps.map((label) => (
                <Step key={label} >
                  <StepLabel StepIconComponent={LayoutStepIcon}></StepLabel>
                </Step>
              ))}
            </LayoutStepper>
          </Box>
        </Grid>
      </Box>

      <TitleTypography>{intl.formatMessage({ id })}</TitleTypography>

      <Box mb={5} mt={2}>
        {!option?.notPaperContainer ? (
          <Paper>
            <LayoutContent />
          </Paper>
        ) : (
            <LayoutContent />
          )}

      </Box>
    </Grid>
  );
};

export default withRouter(injectIntl(withMemo(Layout)));
