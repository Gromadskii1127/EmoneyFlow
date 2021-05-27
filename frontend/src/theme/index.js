import { createMuiTheme } from '@material-ui/core';
import typography from './typography';

const MuiTheme = createMuiTheme({
  palette: {
    primary: {
      main: '#228FEE'
    },
    secondary: {
      main: '#05243F'
    },
    text: {
      secondary: '#228FEE',
      primary: '#05243F',
      black: '#000000',
      grey: '#A5A4A4',
      copiedColor: '#FDC93D'
    },
    background: {
      cyan: '#7E84A3',
      primary: '#000',              
      green: '#5FDD35'
    },
    card: {
      background: '#F4F4F4',
      shadow: '#00000029',
      subCardBackColor: '#EDEDED'
    },

  },
  typography,
  overrides: {
    MuiButton: {
      root: {
        fontSize: 12,
        letterSpacing: '2.16px',
        textTransform: 'uppercase',
        fontWeight: 700,
        borderRadius: '2px',
        height: '34px'
      }
    },
    MuiFormControlLabel: {
      label: {
        fontWeight: 600,
        fontSize: 14,
        color: '#000000'
      }
    },
    MuiInput: {
      underline: {
        '&:before': {
          borderBottom: '1px solid #E2E2E2 !important'
        },
        '&:after': {
          borderBottom: '1px solid #707070 !important'
        }
      },
      input: {
        '&::placeholder': {
          fontSize: '14px',
          fontweight: 400,
          letterSpacing: '0px',
          color: '#000',
          opacity: 0.3
        }
      }
    }
  },
  size: {
    tableActionColumnWidth: '50px'
  },
  card: {
    borderRadius: '10px'
  },
  font: {
    size: {
      middle: '14px',
      small: '11px'
    }
  }
});

export default MuiTheme;
