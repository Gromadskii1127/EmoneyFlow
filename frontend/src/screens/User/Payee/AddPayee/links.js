import { styled } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';

const PayeeIcon = styled(Typography)({
  fontSize: '40px',
  color: '#22eec1'
})
const Links = [{
  url: '/user/upload-payee',
  icon: <PayeeIcon className="emicon-hdd-up"/>
}, {
  url: '/user/new-payee',
  icon: <PayeeIcon className="emicon-user-plus"/>
}];

export default Links;
