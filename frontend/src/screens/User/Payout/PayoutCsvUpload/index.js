import CheckoutProcess from './../../components/CheckoutProcess';
import Layout from './layout';
import Routes from './routes';
import options from './option';

const PayoutCsvUploadProcess = (props) => (
  <CheckoutProcess 
    {...props}
    id="user.upload.payout"
    layout={Layout}
    routes={Routes}
    options={options}
    exitUrl="/user/add-payout"
    apiUrl="/api/v0/add-payout"
    excludeStepCount={2}
    />
)

export default PayoutCsvUploadProcess;
