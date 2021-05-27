import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Grid } from '@material-ui/core';
//Project 
import { SignInForm, OtpForm, ForgotForm, ForgotSuccessForm, NewPwdForm } from './components';
import { ENUMS } from 'constant';
//Image
import leftSideImg from 'assets/images/auth/leftside.png';

const Authentication = ({ dispatch,  formType, ...props}) => {
  return (
    <Fragment>
      <div className="app-wrapper vh-100 overflow-hidden">
        <div className="app-content p-0 w-100">
          <Grid container direction="row" className="h-100">
            <Grid item lg={3} md={3} sm={3} className="overflow-hidden h-100">
              <img
                alt="side"
                className="h-100 d-block image-fluid"
                src={leftSideImg}
              />
            </Grid>
            <Grid item lg={9} md={9} sm={9} xs={12}>
              {
                  formType === ENUMS.AuthenticationFormType.Signin ? (<SignInForm {...props}/>)
                : formType === ENUMS.AuthenticationFormType.Otp ? (<OtpForm {...props}/>) 
                : formType === ENUMS.AuthenticationFormType.Forgot ? (<ForgotForm {...props}/>) 
                : formType === ENUMS.AuthenticationFormType.ForgotSuccess ? (<ForgotSuccessForm {...props}/>) 
                : formType === ENUMS.AuthenticationFormType.NewPassword ? (<NewPwdForm {...props}/>) : ""
              }
            </Grid>
          </Grid>
        </div>
      </div>
    </Fragment>
  );
};

const state = createStructuredSelector({});
export default connect(state)(Authentication);
