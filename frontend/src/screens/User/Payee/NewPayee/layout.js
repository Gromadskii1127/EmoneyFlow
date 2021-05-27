import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { getUserData } from 'redux/selectors/AddPayeeSelector';

import Layout from '../../components/CheckoutProcess/layout';

const state = createStructuredSelector({
  userData: getUserData
});
export default connect(state)(Layout);