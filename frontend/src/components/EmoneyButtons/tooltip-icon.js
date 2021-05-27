import { Tooltip, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  tooltip: {
    backgroundColor: '#000'
  },
  arrow: {
    '&:hover': {
      backgroundColor: '#000'
    }
  }
}));

const ToolTipIconButton = ({ icon, title, ...props }) => {
  const classes = useStyles();

  return (
    <Tooltip classes={classes} arrow title={title} placement="top">
      <IconButton size="medium" onClick={props.onClick}>
        {icon}
      </IconButton>
    </Tooltip>
  );
};

export default ToolTipIconButton;
