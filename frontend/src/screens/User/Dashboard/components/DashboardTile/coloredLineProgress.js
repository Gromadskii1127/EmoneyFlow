import { makeStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';

const useStyles = makeStyles({
  // style rule
  colorPrimary: props => ({
    backgroundColor: props.light,
  }),
  barColorPrimary: {
    // CSS property
    backgroundColor: props => props.main,
  },
});

const ColoredLineProgress = (props) => {
  const classes = useStyles(props);
  return <LinearProgress {...props} style={{width: '100%'}} classes={{colorPrimary: classes.colorPrimary, barColorPrimary: classes.barColorPrimary}}/>;
};

export default ColoredLineProgress;
