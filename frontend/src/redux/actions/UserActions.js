import * as actionTypes from 'redux/actionTypes';
import AWS from 'aws-sdk';
import { CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';
import Pool from './UserPool'
import { SUCCESS_SUFFIX } from 'constant';
import { USER_GET_INFO, USER_UPDATE_INFO, USER_MFA } from 'constant/urls';
const cognito = new AWS.CognitoIdentityServiceProvider({ region: process.env.REACT_APP_AWS_REGION });
let user;

export const getSession = async () =>
    await new Promise((resolve, reject) => {
        const user = Pool.getCurrentUser()
        if (user) {
            user.getSession(async (err, session) => {
                if (err) {
                    reject()
                } else {
                    const attributes = await new Promise((resolve, reject) => {
                        user.getUserAttributes((err, attributes) => {
                            if (err) {
                                reject(err)
                            } else {
                                const results = {}

                                for (let attribute of attributes) {
                                    const { Name, Value } = attribute
                                    results[Name] = Value
                                }


                                resolve(results)
                            }
                        })
                    })

                    const accessToken = session.accessToken.jwtToken

                    console.log('accessToken = ', accessToken);
                    const mfaEnabled = await new Promise((resolve) => {
                        cognito.getUser(
                            {
                                AccessToken: accessToken,
                            },
                            (err, data) => {
                                if (err) resolve(false)
                                else
                                    resolve(
                                        data.UserMFASettingList 
                                        && data.UserMFASettingList.includes('SOFTWARE_TOKEN_MFA')
                                    )
                            }
                        )
                    })

                    const token = session.getIdToken().getJwtToken()
                    console.log('token = ', token);
                    console.log('token = ', attributes['custom:apiKey']);
                    console.log('mfa status = ',mfaEnabled);
                    
                    resolve({
                        user,
                        accessToken,
                        mfaEnabled,
                        headers: {
                            'X-Api-Key': attributes['custom:apiKey'],
                            Authorization: token,
                            'X-Amz-Security-Token': accessToken
                        },
                        ...session,
                        ...attributes,
                    })
                }
            })
        } else {
            reject()
        }
    });


export const fetch = () => async (dispatch) => {
    try {
        const session = await getSession();  
        if (session) {
            dispatch({
                type: actionTypes.USER_LOGIN + SUCCESS_SUFFIX,
                payload: {
                    userType: session['custom:userType'] ? session['custom:userType'] : 0,
                    firstName: session['family_name'],
                    lastName: session['given_name'],
                    email: session['email'],
                    mfaEnabled: session['mfaEnabled'],                    
                    accessToken: session['accessToken']['jwtToken'],
                    authToken: session['headers']['Authorization'],   
                    apiKey: session['headers']['X-Api-Key']                                     
                }
            });
        }
    }
    catch (error) {

    }
};

export const setMFAEnabled = (val) => async (dispatch ) => {
    dispatch({
        type: actionTypes.USER_ENABLED_MFA,
        payload: {
            value: val
        }
    })
}
export const getUserInfo = () => async (dispatch) => {
    console.log('get User info')
    return dispatch({
        type: actionTypes.USER_GET_INFO,
        payload: {
            request: {
                url: USER_GET_INFO,
                method: 'GET',
            }
        }
    });
}

export const updateUserInfo = (user) => async (dispatch) => {
    return dispatch({
        type: actionTypes.USER_UPDATE_INFO,
        payload: {
            request: {
                url: USER_UPDATE_INFO,
                method: 'POST',
                data: user
            }
        }
    });
}

export const getQRCode = () => async (dispatch) => {

    return dispatch({
        type: actionTypes.USER_GET_QR_CODE,
        payload: {
            request: {
                url: USER_MFA,
                method: 'GET',
            }
        }
    });
}
export const enableMFA = (code) => async (dispatch) => {

    return dispatch({
        type: actionTypes.USER_ENABLE_MFA,
        payload: {
            request: {
                url: USER_MFA,
                method: 'POST',
                data: {
                    code: code
                }
            }
        }
    });
}
export const disableMFA = (code) => async (dispatch) => {

    return dispatch({
        type: actionTypes.USER_DISABLE_MFA,
        payload: {
            request: {
                url: USER_MFA,
                method: 'DELETE',
                data: {
                    code: code
                }
            }
        }
    });
}
export const checkOtpCode = ({ code, username }, onSuccess, onFailure) => async (dispatch) => {
    const onSuccessCheck = async (data) => {
        await dispatch(fetch());       
        
        if (onSuccess instanceof Function) {
            onSuccess(data);
        }
        
    }

if (user) {
    user.sendMFACode(
        code,
        {
            onSuccess: onSuccessCheck,
            onFailure: onFailure ? onFailure : () => { }
        },
        'SOFTWARE_TOKEN_MFA'
    )
}
};
export const login = ({ username, password }, onSuccess, onFailure, onNewPwdRequired, onTotpRequire) => async (dispatch) => {
    const onSuccessLogin = async (data) => {   
        await dispatch(fetch());
        dispatch(getUserInfo()).then(response => {
            if (onSuccess instanceof Function) onSuccess(data); 
        })
        
    }

    const handleTotpRequired = () => {
        dispatch({
            type: actionTypes.USER_SET_USERNAME,
            payload: {
                data: username
            }
        })

        if (onTotpRequire instanceof Function) {
            onTotpRequire();
        }
    }
    try {
        user = new CognitoUser({ Username: username, Pool })
        const authDetails = new AuthenticationDetails({ Username: username, Password: password })

        user.authenticateUser(authDetails, {
            onSuccess: onSuccessLogin,
            onFailure: onFailure instanceof Function ? onFailure : () => { },
            newPasswordRequired: onNewPwdRequired instanceof Function ? onNewPwdRequired : () => { },
            totpRequired: handleTotpRequired,
        })
    }
    catch (err) {
        throw Error(err);
    }
};
export const forgotPassword = (email, onSuccess, onFailure, inputVerificationCode) => async (dispatch) => {
    const user = new CognitoUser({ Username: email.toLowerCase(), Pool });
    user.forgotPassword({
        onSuccess: data => {
            console.log("onSuccess:", data);
            if (onSuccess) {
                onSuccess(data)
            }
        },
        onFailure: err => {
            console.error("onFailure:", err);
            if (onFailure) {
                onFailure(err);
            }
        },
        inputVerificationCode: data => {
            console.log("Input code:", data);
            if (inputVerificationCode) {
                inputVerificationCode(data);
            }
        }
    });
}

export const resetPassword = (email, code, password, onSuccess, onFailure) => async (dispatch) => {
    console.log('code  ', code, 'email = ', email);
    const user = new CognitoUser({ Username: email.toLowerCase(), Pool });
    
    user.confirmPassword(code, password, {
        onSuccess: data => {
            console.log('onSuccess ', data);
            if (onSuccess) {
                onSuccess(onSuccess)
            }
        },
        onFailure: err => {
            console.error('onError ', err);
            if (onFailure) {
                onFailure(err);
            }
        }
    })
}

export const setNewPassword = (email,password, userAttribute, onSuccess, onFailure) => async (dispatch) => {            
    delete userAttribute.email_verified;
    user.completeNewPasswordChallenge(password, userAttribute, {
        onSuccess: data => {
            console.log('onSuccess ', data);
            if (onSuccess) {
                onSuccess(onSuccess)
            }
        },
        onFailure: err => {
            console.error('onError ', err);
            if (onFailure) {
                onFailure(err);
            }
        }
    })
}

export const logout = () => async (dispatch) => {
    const user = Pool.getCurrentUser()
    if (user) {
        await user.signOut();
    }
    dispatch({
        type: actionTypes.USER_LOGOUT
    });
    dispatch({
        type: actionTypes.USER_LOGGED_OUT
    });

}
export const UserActions = [
    actionTypes.USER_LOGIN + SUCCESS_SUFFIX, actionTypes.USER_GET_INFO + SUCCESS_SUFFIX, actionTypes.USER_UPDATE_INFO + SUCCESS_SUFFIX, actionTypes.USER_LOGOUT
];
