import CheckoutProcess from '../../components/CheckoutProcess';
import Layout from './layout';
import Routes from './routes';
import options from './option';
const NewPayeeProcess = ({ onAddPayee, ...props }) => (
  <CheckoutProcess
    {...props}
    id="add-payee"
    layout={Layout}
    routes={Routes}
    hideStepper={true}
    exitUrl="/user/add-payee"
    finishUrl="/user/payees"
    onCompleted={onAddPayee}    
    options={options}
    excludeStepCount={1}
  />
);

export default NewPayeeProcess;
