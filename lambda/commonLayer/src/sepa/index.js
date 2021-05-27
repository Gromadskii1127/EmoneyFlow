const axios = require('axios');
const sepaHostUrl = 'https://sepaexpress-sand-fx.azurewebsites.net';
const sepaHostPayoutUrl = sepaHostUrl + '/api/services/v2/Payouts';
const sepaHostSigninApiUrl = sepaHostUrl + '/api/identity/v1/TokenAuth/Authenticate/'
const sepaHostReconciliation = sepaHostUrl + '/api/services/v2/Reconciliations/'
module.exports.loginWithSepa = async (api) => {
    return new Promise((resolve, reject) => {
        axios.post(sepaHostSigninApiUrl, {
            tenantName: api.apitenant,
            username: api.apiUsername,
            password: api.apiPassword,
            expireInSeconds: api.expiration
        }, {
            headers: {
                'Content-Type' : 'application/json',
                'Accept': 'application/json'
            }
        }).then(function (data) {
            console.log('data = ', data);
            resolve(data);
        }).catch(function (err) {
            console.log('error =', err);
            reject(err);
        });
    })
}
module.exports.createSepaPayment = (api, payee, payout) => {    
    return new Promise((resolve, reject) => {
        const requestObj = {
            bankAccount: {
                customer: {
                    merchantId: api.merchantId,
                    givenName: payee.firstName,
                    familyName: payee.lastName,
                    addressLine1: payee.addressLine1,
                    countryCode: payee.countryCode,
                    languageCode: payee.languageCode,
                    emailAddress: payee.email
                },
                memo: payee.memo,
                iban: payee.iban
            },
            connectorId: api.connectorId,
            currencyCode: payee.currency,
            amount: payout.amount
        };
        const headers = {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + api.token
            }
        };
        axios.post(sepaHostPayoutUrl, requestObj, headers).then(data => {
            resolve({id: payout.id, success: true, data: data}); 
        }).catch(error => {
            resolve({id: payout.id, success: false, error: error});
        });
    })
}

module.exports.getReconciliation = (payout, api) => {    
    return new Promise((resolve, reject) => {        
        const headers = {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + api.token
            }
        };
        if (payout.payout){
            axios.get(sepaHostReconciliation + payout.payment, headers).then(data => {
                resolve({id: payout.id, success: true, data: data}); 
            }).catch(error => {
                resolve({id: payout.id, success: false, error: error});
            });
        } else {
            resolve({id: payout.id, success: false, error: 'Payout Id is null'});
        }
        
    })
}
