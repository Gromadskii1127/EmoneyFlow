import { DropzoneArea } from 'material-ui-dropzone';
import { withStyles } from '@material-ui/core/styles';
const EmoneyDropzoneArea = withStyles((theme) => ({
  root: {
    background: theme.palette.grey["200"],
    display: 'flex',
    direction: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    color: theme.palette.grey["900"],
    marginTop: 0,
    marginBottom: theme.spacing(1),
    fontSize: 20
  },
  icon: {
    color: theme.palette.grey["900"],
    width: 30,
    height: 30,
  }
}))(DropzoneArea);