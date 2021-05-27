import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { getUserData } from 'redux/selectors/PayoutUploadCsvSelector';
import Layout from './../../components/CheckoutProcess/layout';

const state = createStructuredSelector({
  userData: getUserData
});
export default connect(state)(Layout);