import Upload from './Upload';
import Fields from './Fields';
import Summary from './Summary';
import { Complete } from './../components';

import PayeeFieldDefinitions from './Fields/fields';

const PayeeRoutes = [
  {
    path: 'upload',
    component: Upload
  },
  {
    path: 'fields',
    component: (props) => (
      <Fields {...props} fieldDefinitions={PayeeFieldDefinitions} />
    )
  },
  {
    path: 'summary',
    component: Summary
  },
  {
    path: 'complete',
    component: Complete
  }
];

// const PaymentRoutes = [
//   {
//     path: 'upload',
//     component: Upload
//   },
//   {
//     path: 'fields',
//     component: (props) => (
//       <Fields {...props} fieldDefinitions={PaymentDefinitions} />
//     )
//   },
//   {
//     path: 'summary',
//     component: (props) => (
//       <Fragment>
//         <Summary {...props} />
//         <Box mt={3}>
//           <Grid container justify="flex-end">
//             <PaymentDate {...props}></PaymentDate>
//           </Grid>
//         </Box>
//       </Fragment>
//     )
//   },
//   {
//     path: 'amount',
//     component: PaymentAmount
//   },
//   {
//     path: 'complete',
//     component: Complete
//   }
// ];

export default PayeeRoutes;
