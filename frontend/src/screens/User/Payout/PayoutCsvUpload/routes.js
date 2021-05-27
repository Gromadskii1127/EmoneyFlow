import Upload from './Upload';
import Fields from './Fields';
import Summary from './../components/Summary';
import Complete from './../components/Complete';
import Review from './Review';
const Routes = [{
  path: 'upload',
  component: Upload
}, 
{
  path: 'fields',
  component: Fields
}, 
{
  path: 'review',
  component: Review
}, 
{
  path: 'summary',
  component: Summary
}, 
{
  path: 'complete',
  component: Complete
}];

export default Routes;
