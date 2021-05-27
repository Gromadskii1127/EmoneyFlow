import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { getUserData } from 'redux/selectors/PayeeUploadCsvSelector';

import Layout from '../../components/CheckoutProcess/layout';

const state = createStructuredSelector({
  userData: getUserData
});
export default connect(state)(Layout);