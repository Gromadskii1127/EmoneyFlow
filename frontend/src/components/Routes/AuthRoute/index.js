import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Route, Redirect } from 'react-router';
// Redux Selector
import { getUser } from 'redux/selectors';

// Project Structure
import { withMemo } from 'components/HOC';

//Constant 
import { ENUMS } from 'constant';
const AuthRoute = ({ component: Component, user, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props => {
        if (user.isAuthorized === true) {
          if ((user.userType === ENUMS.UserType.Admin && props.location.pathname.startsWith("/admin")) ||
            (user.userType === ENUMS.UserType.User && props.location.pathname.startsWith("/user"))
          ) {
            return <Component {...props} />;
          }
          else if (user.userType === ENUMS.UserType.User && !props.location.pathname.startsWith("/user")) {
            return <Redirect to={{ pathname: '/user/dashboard', state: { from: props.location } }} />;
          }
          else if (user.userType === ENUMS.UserType.Admin && !props.location.pathname.startsWith("/admin")) {
            return <Redirect to={{ pathname: '/admin/transaction', state: { from: props.location } }} />;
          }
        }
        else {
          return <Redirect to={{ pathname: '/user/signin', state: { from: props.location } }} />;

        }
      }
    }
    />)
};

const state = createStructuredSelector({
  user: getUser
});

export default connect(state)(withMemo(AuthRoute));
