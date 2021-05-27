import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Route, Redirect } from 'react-router';
// Redux Selector
import { getUser } from 'redux/selectors';

// Project Structure
import { withMemo } from 'components/HOC';

// Constant
import { ENUMS } from 'constant';

const NotAuthRoute = ({ component: Component, user, ...rest }) => {    
    return (
        <Route
            {...rest}
            render={(props) =>
                user?.isAuthorized === false ? (
                    <Component {...props} />
                ) : user?.userType === ENUMS.UserType.Admin ? (
                    <Redirect
                        to={{ pathname: '/admin/transaction', state: { from: props.location } }}
                    />
                ) : user?.userType === ENUMS.UserType.User ? (
                    <Redirect
                        to={{ pathname: '/user/dashboard', state: { from: props.location } }}
                    />
                ) : (<div></div>)
            }
        />
    );
};

const state = createStructuredSelector({
    user: getUser
});

export default connect(state)(withMemo(NotAuthRoute));
