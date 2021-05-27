import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { Container } from '@material-ui/core';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'
// Project Components
import { Header, Sidebar } from './components';
import UserSetting from 'screens/User/UserSetting'
const PresentationLayout = props => {
  const { children } = props;
  const [openSetting, setOpenSetting] = useState(false);
  const handleOpenSetting = useCallback(() => {
    console.log('open setting = ', openSetting);
    setOpenSetting(true);    
  }, [openSetting]);

  const handleCloseSetting = useCallback(() => {    
    setOpenSetting(false);
  }, []);
  return (
    <div className="app-wrapper vh-100 overflow-hidden flex-column">
      <Header title={props.headerTitle} handleOpenSetting={handleOpenSetting} />
      <div className="flex-grow-1 app-content p-0 w-100 app-container d-flex flex-row">
        <Sidebar menuList={props.sidebarMenu || ''} {...props} />
        <Container maxWidth="xl" className="page-container">
          {children}
        </Container>
      </div>
      <UserSetting open={openSetting} handleCloseSetting={handleCloseSetting} />
    </div>
  );
};

PresentationLayout.propTypes = {
  children: PropTypes.node
};

const mapStateToProps = state => ({

});

export default connect(mapStateToProps)(withRouter(PresentationLayout));
