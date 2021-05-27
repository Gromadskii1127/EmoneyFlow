import Payout from './Payout';
import Complete from './../components/Complete';
import Summary from './../components/Summary';

const NewPayoutRoutes = [
  {
    path: 'payout',
    component: Payout
  },
  {
    path: 'summary',
    component: Summary
  },
  {
    path: 'success',
    component: Complete
  }
];
export default NewPayoutRoutes;
