import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import { kebabCase } from 'lodash';
import OptionPaper from './index';

const useStyle = makeStyles(theme => ({
  grid: {
    [theme.breakpoints.up('sm')]: {
      width: '367px',
      height: '218px'
    },
    [theme.breakpoints.only('xs')]: {
      width: '100%'
    }
  }
}));

const OptionPaperLinks = ({links}) => {
  const classes = useStyle();

  return (
    <Grid container spacing={6}>
      {links.map(link => (
        <Grid key={link.url} className={classes.grid} item xs={12} md={6}>
          <Link to={link.url}>
            <OptionPaper 
              id={kebabCase(link.url)}
              icon={link.icon}>
            </OptionPaper>
          </Link>
        </Grid>
      ))}
    </Grid>
  )
};

export default OptionPaperLinks;
