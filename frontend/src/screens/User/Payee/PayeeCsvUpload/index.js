import CheckoutProcess from '../../components/CheckoutProcess';
import Layout from './layout';
import PayeeRoutes from './routes';
import * as PayeeActions from 'redux/actions/PayeeActions';
import options from './option';

const CsvUploadProcess = ({ onAddPayees, ...props }) => (
  <CheckoutProcess
    {...props}
    layout={Layout}
    id="upload-payee"
    exitUrl="/user/add-payee"
    finishUrl="/user/payees"
    routes={PayeeRoutes}    
    options={options}
    onCompleted={(data) =>
      PayeeActions.addPayees(data.summary.data)
    } />
);

export default CsvUploadProcess;
