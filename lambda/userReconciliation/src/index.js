const Sequelize = require('/opt/node_modules/sequelize');
const Op = Sequelize.Op; 
const connectToDatabase = require('/opt/database/db');
const { updateDocument } = require('/opt/elastic/elasticservice');
const { loginWithSepa } = require('/opt/sepa');
const axios = require('/opt/node_modules/axios');
const sepaHostUrl = 'https://sepaexpress-sand-fx.azurewebsites.net';
const sepaHostReconciliation = sepaHostUrl + '/api/services/v2/Reconciliations/'
const API_EXPIRATE_SECOND = 3600;

const getReconciliations = (api, before, after, limit) => {    
    return new Promise((resolve, reject) => {        
        const parameters = {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + api.token
            },
            params: {
                connectorId: api.connectorId,
                merchantId: api.merchantId,
            }
        };
        if (before !== '') {
            parameters['params']['before'] = before
        }
        if (after !== '') {
            parameters['params']['after'] = after
        }
        if (limit !== '') {
            parameters['params']['limit'] = limit;
        }
        
        console.log('Params = ', parameters);
        axios.get(sepaHostReconciliation, parameters).then(data => {
            resolve({id: api.id, success: true, data: data.data}); 
        }).catch(error => {
            resolve({id: api.id, success: false, error: error});
        });
        
    })
}

const checkApiAndGetToken = async (api) => {
    return new Promise(async (resolve, reject) => {
        const { API } = await connectToDatabase();
        if (api) {
            const token = api.token;
            const startDate = api.startDate ? api.startDate : "0";
            const expiration = api.expiration ? api.expiration : 0;
            const nowDate = Date.now();
            const sDate = Date.parse(startDate);
    
            api.expiration = API_EXPIRATE_SECOND;
            try {
                const response = await loginWithSepa(api);
                if (response.data.accessToken) {
                    await API.update({
                    startDate: new Date(),
                    token: response.data.accessToken,
                    expiration: response.data.expireInSeconds,
                    status: 1
                    }, { where : { id: api.id}});
                    const updatedApi = await API.findOne({where: { id: api.id}});
                    resolve({ success: true, api: updatedApi});
                } else {
                    resolve({ success: false, api: api});
                }
            } catch (error) {
                resolve({ success: false, api: api});
            }
        } else {
            resolve({ success: false, api: api});
        }    
    });
}

const getConciliationAndUpdate = async (api) => {
    return new Promise(async (resolve, reject) => {
        const apiResponse = await checkApiAndGetToken(api);
        console.log('api Response = ', apiResponse);
        if (apiResponse.success){
            const { Payout, Company, API, Payee } = await connectToDatabase();
            let before = '', after = '', limit = '';
            let count = 0;
            let responseStatus = false;
            let tryCount = 0;
            const reconUpdatePromises = [];
            do {
                console.log('after = ', after);
                const response = await getReconciliations(api, '', after, limit);
                console.log('response = ', response);
                responseStatus = response.success;
                
                if (response.success ){
                    tryCount = 0;
                    before = response.data.meta.before;
                    after = response.data.meta.after;
                    count = response.data.meta.count;
                    console.log('countaaaa = ', count)
                    const reconciliations = response.data.reconciliations;
                    reconciliations.forEach(async (reconciliation, index) => {
                        reconUpdatePromises.push(
                            new Promise(async (resolve, reject) => {
                                try{
                                    delete reconciliation.id;
                                    const result = await Payout.update({ state: reconciliation.state}, { where: {
                                        payoutId: reconciliation.payoutId,
                                        currency: reconciliation.currencyCode,
                                        amount: -reconciliation.amount,
                                        apiId: api.id,
                                    }});
                                    const updatedPayout = await Payout.findOne({
                                        include: [Payee, Company, API],
                                        where: {
                                            payoutId: reconciliation.payoutId
                                        }
                                    });
                                    if (updatedPayout !== null){
                                        console.log('updatedPayout = ', updatedPayout);
                                        const result1 = await updateDocument(updatedPayout.id, updatedPayout);
                                    }    
                                    resolve(true)
                                } catch (err){
                                    console.log('error = ', err)
                                    resolve(false);
                                }
                                
                                
                            })
                        );
                    });
                } else {
                    tryCount ++;
                }
            }
            while((count > 0 && responseStatus) || (!responseStatus && tryCount < API_TRY_COUNT) )
            
            resolve({ success: true, promises: reconUpdatePromises});
            
        } else {
            resolve({ success: false, message: 'Failed to get api token '})
        }
    })
    
    
}

const COUNT = 10;
const API_TRY_COUNT = 3;
exports.handler = async (event, context, callback) => {
    const { Payout, API } = await connectToDatabase();
    const promises = [];
    let subpromises = [];
    let apis = [];
    let i = 0;
    while ((apis = await API.findAll({ 
        offset:COUNT * i, 
        limit: COUNT,
        include: {
            model: Payout,
            where: {
                state: {
                    [Op.not]: "paid"
                }
            }
        }
    })).length > 0)
    {
        i = i + 1;
        apis.forEach((api, index) => {
            if (api.payouts.length > 0) {
                promises.push(
                    new Promise(async (resolve, reject) => {
                        getConciliationAndUpdate(api).then(response => {
                            if (response.success){
                                subpromises = [].concat(subpromises, response.promises);
                                resolve(true)
                            } else {
                                resolve(false)
                            }
                            
                        })    
                    })
                    
                )    
            }
            
        });
    }
    console.log('promise response = ', await Promise.all(promises));
    console.log('subpromises = ', subpromises);
    console.log('responses = ', await Promise.all(subpromises));
};
