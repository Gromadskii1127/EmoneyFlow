import ReportProblemOutlinedIcon from '@material-ui/icons/ReportProblemOutlined';
import ArrowUpwardOutlinedIcon from '@material-ui/icons/ArrowUpwardOutlined';

export const DashboardTileType = {
  warning: {
    color: 'warning',
    icon: ArrowUpwardOutlinedIcon,
    translation: {
      id: 'pending',
      defaultMessage: 'pending'
    }
  },
  success: {
    color: 'success',
    icon: ArrowUpwardOutlinedIcon,
    translation: {
      id: 'success',
      defaultMessage: 'success'
    }
  },
  error: {
    color: 'error',
    icon: ReportProblemOutlinedIcon,
    translation: {
      id: 'declinedOrError',
      defaultMessage: 'declined or error'
    }
  },
};
