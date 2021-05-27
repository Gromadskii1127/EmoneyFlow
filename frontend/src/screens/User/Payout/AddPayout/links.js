import { styled } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';

const PayoutIcon = styled(Typography)({
  fontSize: '40px',
  color: '#22eec1'
})

const Links = [{
  url: '/user/upload-payout',
  icon: <PayoutIcon className="emicon-hdd-up"/>
}, {
  url: '/user/new-payout',
  icon: <PayoutIcon className="emicon-list3"/>
}];

export default Links;
