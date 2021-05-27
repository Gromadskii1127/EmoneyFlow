import React, { Suspense, Fragment, lazy } from 'react';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { Switch, Route, Redirect } from 'react-router-dom';
import { ClimbingBoxLoader } from 'react-spinners';
import { FormattedMessage } from 'react-intl';
import { ToastContainer, toast } from 'react-toastify'
import { injectIntl } from 'react-intl'
import 'react-toastify/dist/ReactToastify.css';

// Layout Blueprints
import { MinimalLayout, PresentationLayout } from './layout';
import { adminRoutes, userRoutes } from 'constant/routes';

//constant
import { ENUMS } from 'constant';

// Actions
import * as UserActions from 'redux/actions/UserActions';
import * as PayeeActions from 'redux/actions/PayeeActions';
import * as ErrorActions from 'redux/actions/ErrorActions';
import { getErrorList } from 'redux/selectors/ErrorSelector';
import { getUser } from 'redux/selectors/UserSelector';
const NotAuthRoute = lazy(() => import('components/Routes/NotAuthRoute'));
const AuthRoute = lazy(() => import('components/Routes/AuthRoute'));

const Authentication = lazy(() => import('screens/Authentication'));
// Admin pages
const Transaction = lazy(() => import('screens/Admin/Transaction'));
const Company = lazy(() => import('screens/Admin/Company'));
const User = lazy(() => import('screens/Admin/User'));
// User pages
const Dashboard = lazy(() => import('screens/User/Dashboard'));
const UserTransaction = lazy(() => import('screens/User/Transaction'));
const AddPayee = lazy(() => import('./screens/User/Payee/AddPayee'));
const NewPayee = lazy(() => import('./screens/User/Payee/NewPayee'));
const PayeeCsvUpload = lazy(() => import('./screens/User/Payee/PayeeCsvUpload'));
const PayeeOverview = lazy(() => import('./screens/User/Payee/PayeeOverview'));

const NewPayout = lazy(() => import('./screens/User/Payout/NewPayout'));
const AddPayout = lazy(() => import('./screens/User/Payout/AddPayout'));
const PayoutCsvUpload = lazy(() => import('./screens/User/Payout/PayoutCsvUpload'));

const SuspenseLoading = () => {
  return (
    <Fragment>
      <div className="d-flex align-items-center flex-column vh-100 justify-content-center text-center py-3">
        <div className="d-flex align-items-center flex-column px-4">
          <ClimbingBoxLoader color={'#5383ff'} loading={true} />
        </div>
        <div className="text-muted font-size-xl text-center pt-3">
          <FormattedMessage
            id="suspenseloading.text1"
            defaultMessage="Please wait while we load the live preview examples"
          />
          <span className="font-size-lg d-block text-dark">
            <FormattedMessage
              id="suspenseloading.text2"
              defaultMessage="This live preview instance can be slower than a real production build!"
            />
          </span>
        </div>
      </div>
    </Fragment>
  );
};

const Routes = ({ dispatch, user, intl, errorList }) => {
  /**
   * Fetch user info
   */
  React.useEffect(() => {
    if (user?.isAuthorized){
      dispatch(UserActions.getUserInfo());
    }
    
  }, [dispatch, user?.isAuthorized]);

  React.useEffect(() => {    
    errorList.forEach((error, index) => {    
      console.log('user authorized ', error)  ;
      if (user?.isAuthorized){
        toast(error.translateType ? intl.formatMessage({id: error.message}) : error.message);
      }
      dispatch(ErrorActions.removeError());
    })
  }, [errorList, dispatch, user?.isAuthorized, intl]);
  return (
    <Suspense fallback={<SuspenseLoading />}>
      <Switch>        
        <Redirect exact from="/" to="/user/signin" />
        <Route path={['/user/signin', '/user/otp', '/user/forgot', '/user/forgotsuc', '/user/newpwd']}>
          <MinimalLayout>
            <NotAuthRoute
              path="/user/signin"
              component={() => {
                return (
                  <Authentication
                    formType={ENUMS.AuthenticationFormType.Signin}
                  />
                );
              }}
            />
            <NotAuthRoute
              path="/user/otp"
              component={() => {
                return (
                  <Authentication formType={ENUMS.AuthenticationFormType.Otp} />
                );
              }}
            />
            <NotAuthRoute
              path="/user/forgot"
              component={() => {
                return (
                  <Authentication formType={ENUMS.AuthenticationFormType.Forgot} />
                );
              }}
            />
            <NotAuthRoute
              path="/user/forgotsuc"
              component={() => {
                return (
                  <Authentication formType={ENUMS.AuthenticationFormType.ForgotSuccess} />
                );
              }}
            />
            <NotAuthRoute
              path="/user/newpwd"
              component={() => {
                return (
                  <Authentication formType={ENUMS.AuthenticationFormType.NewPassword} />
                );
              }}
            />
          </MinimalLayout>
        </Route>
        <Route path={['/admin/transaction', '/admin/company', '/admin/user']}>
          <PresentationLayout sidebarMenu={adminRoutes}>
            <AuthRoute path="/admin/transaction" component={Transaction} />
            <AuthRoute path="/admin/company" component={Company} />
            <AuthRoute path="/admin/user" component={User} />
          </PresentationLayout>
        </Route>
        <Route
          path={[
            '/user/dashboard',
            '/user/transaction',
            '/user/payees',
            '/user/add-payee',
            '/user/new-payee',
            '/user/upload-payee',
            '/user/add-payout',
            '/user/new-payout',
            '/user/upload-payout',
          ]}>
          <PresentationLayout sidebarMenu={userRoutes}>
            <AuthRoute path="/user/transaction" component={UserTransaction} />
            <AuthRoute path="/user/dashboard" component={Dashboard} />

            <AuthRoute
              path="/user/add-payout"
              component={AddPayout}></AuthRoute>
            <AuthRoute
              path="/user/upload-payout"
              component={(props) => <PayoutCsvUpload {...props} />}
            />
            <AuthRoute
              path="/user/new-payout"
              component={NewPayout}></AuthRoute>
            <AuthRoute path="/user/payees" component={PayeeOverview} />
            <AuthRoute path="/user/add-payee" component={AddPayee} />
            <AuthRoute
              path="/user/upload-payee"
              component={(props) => (
                <PayeeCsvUpload {...props} />
              )}
            />
            <AuthRoute
              path="/user/new-payee"
              component={(props) => (
                <NewPayee
                  {...props}
                  onAddPayee={(p) => PayeeActions.addPayees([p])}
                />
              )}
            />

          </PresentationLayout>
        </Route>
      </Switch>
      <ToastContainer />
    </Suspense>
  );
};

const state = createStructuredSelector({
  errorList: getErrorList,
  user: getUser
});
export default connect(state)(injectIntl(Routes));
