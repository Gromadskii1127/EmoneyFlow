import { Typography } from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';

const useStyle = makeStyles(theme => ({
  grid: {
    fontSize: '12px',
    color: '#05243F'
  }
}));

const BackLink = ({url, text, ...props}) => {
  const classes = useStyle();
  return (
    <Link to={url}>
      <Typography
        component="div"
        variant="caption"
        className={classes.grid}
        >
        <ArrowBackIcon style={{marginTop: '-2px', fontSize: 15}} fontSize="small"></ArrowBackIcon>

        <span style={{marginLeft: '5px'}}>{text}</span>
      </Typography>
    </Link>
  );
};

export default BackLink;
