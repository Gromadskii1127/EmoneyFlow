import CheckoutProcess from './../../components/CheckoutProcess';
import Layout from './layout';
import Routes from './routes';
import options from './options';

const NewPayout = (props) => (
  <CheckoutProcess
    {...props}
    id="user.add.payout"    
    layout={Layout}
    routes={Routes}
    hideStepper={true}
    options={options}
    exitUrl="/user/add-payout"
    apiUrl="/api/v0/add-payout"
    exitId=""
    onCompleted={() => {
      console.error(
        'no single payment completed callback implemented. implement on in /src/screens/User/SinglePayout/index.js'
      );
    }}
  />
);
export default NewPayout;
