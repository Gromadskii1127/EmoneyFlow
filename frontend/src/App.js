import React from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { ThemeProvider } from '@material-ui/styles';
import { BrowserRouter } from 'react-router-dom';
import { store } from './config/store/configureStore';
import { Provider } from 'react-redux';
import CssBaseline from '@material-ui/core/CssBaseline';
import ScrollToTop from './utils/ScrollToTop';
import Routes from './Routes';
import './App.css';
import './assets/base.scss';
import { IntlProvider } from 'react-intl';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import Theme from 'theme';
import en from 'lang/en.json';
const messages = { en };

const formats = {
  number: {
    percentWith2Decimals: { style: 'percent', maximumFractionDigits: 2 }
  }
};

function App() {
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Provider store={store}>
        <IntlProvider locale={'en'} messages={messages['en']} formats={formats}>
          <BrowserRouter basename="/">
            <ThemeProvider theme={Theme}>
              <StyledThemeProvider theme={Theme}>
                <CssBaseline />
                <ScrollToTop>
                  <Routes />
                </ScrollToTop>
              </StyledThemeProvider>
            </ThemeProvider>
          </BrowserRouter>
        </IntlProvider>
      </Provider>
    </MuiPickersUtilsProvider>
  );
}

export default App;
