const connectToDatabase = require('/opt/database/db');
const Sequelize = require('/opt/node_modules/sequelize');
const Op = Sequelize.Op;
const { format, addDays } = require("/opt/node_modules/date-fns");
const { loginWithSepa, createSepaPayment } = require('/opt/sepa');
const { indexDocument, updateDocument } = require('/opt/elastic/elasticservice');
const API_EXPIRATE_SECOND = 3600;

const checkApiAndGetToken = async (api) => {
    const { API } = await connectToDatabase();
    
    if (api) {
        const token = api.token;
        const startDate = api.startDate ? api.startDate : "0";
        const expiration = api.expiration ? api.expiration : 0;
        const nowDate = Date.now();
        const sDate = Date.parse(startDate);

        if (token && (nowDate < sDate + expiration * 1000)) {
            return api;
        }
        else {
            api.expiration = API_EXPIRATE_SECOND;
            try {
                const response = await loginWithSepa(api);
                if (response.data.accessToken) {
                    api.startDate = new Date();
                    api.token = response.data.accessToken;
                    api.expiration = response.data.expireInSeconds;
                    api.status = 1;
                    await API.Update(api, {where : { id: api.id}});
                    return api;
                } else {
                    return null;
                }
            } catch (error) {
                return null;
            }


        }
    } else {
        return null;
    }
}

const updatePayout = async (Payout, Payee, id, response) => {
    return new Promise((resolve, reject) => {
        Payout.update({
            payoutId: response.payout.id,
            customerId: response.payout.customerId,
            customerState: response.payout.customer.state,
            bankAccountId: response.payout.bankAccountId,
            bankAccountState: response.payout.bankAccount.state,
            state: response.payout.state,
            payoutCreatedAt: response.payout.payoutCreatedAt,
            rReference: response.payout.reference,
            softDescriptor: response.payout.softDescriptor,
            submitAfter: response.payout.submitAfter,
            status: 201
        }, { where: { id: id } }).then(function () {            
            resolve(Payout.findOne({where: {id}, include: [Payee]}));
        }).catch(function (error) {            
            reject(error);
        });
    })
}

const updatePayouts = async (payoutDatas) => { 
    try {
        const { Payout, Payee, API } = await connectToDatabase();
        let ret = [];
        let promises = [];
        if (Array.isArray(payoutDatas)) {
            const updatedPayouts = [];
            for (var i = 0; i < payoutDatas.length; i++) {
                const payoutData = payoutDatas[i];
                const payeeId = payoutData.payeeId;
                const payee = await Payee.findByPk(payeeId);
                
                if (payee === null){
                    payoutData['statusCode'] = 4;
                    payoutData['message'] = 'Failed to get related payee';
                    updatedPayouts.push(payoutData); 
                    continue;
                }
                
                const api = await checkApiAndGetToken(payoutData.api);

                if (api === null){
                    payoutData['statusCode'] = 0;
                    payoutData['message'] = 'Failed to get api token for this payout';
                    updatedPayouts.push(payoutData);
                    continue;
                }
                if (api.token) {
                    if (payoutData.method === 0){ 
                        promises.push(createSepaPayment(api, payee, payoutData).then(async (response) => {
                            console.log('response id', response.id);
                            if (response.success) {
                                const updated = await updatePayout(Payout, Payee, response.id, response.data.data);
                                const result = updateDocument(updated.id, updated);
                                updated['statusCode'] = 200;
                                updated['message'] = '';
                                updatedPayouts.push(updated);
                            } else {
                                const mPayout = await Payout.findOne({ where: { id: response.id }, include: [Payee]})
                                mPayout['statusCode'] = 3;
                                mPayout['message'] = 'Failed to call api for this payout';
                                updatedPayouts.push(mPayout);
                            }
                        }));
                    } else {
                        payoutData['statusCode'] = 1;
                        payoutData['message'] = 'Not exist API for this payout';
                        updatedPayouts.push(payoutData);
                    }
                    
                }
            }
            if (promises.length > 0) {
                try {
                    await Promise.all(promises);
                    console.log('pro')
                } catch (ex) {
                    console.log('error = ', ex);
                    return 'error ' + JSON.stringify(ex);
                }
            }
            return updatedPayouts;
        } else {
            return [];
        }
    } catch (err) {
        return [];
    }


};

const getCurrentUTCDate = () => {
    var now = new Date();
    var nowUtc = new Date( now.getTime() + (now.getTimezoneOffset() * 60000));
    return nowUtc;
}
const COUNT = 10;

exports.handler = async (event, context, callback) => {
    const currentUtcDate =  getCurrentUTCDate();
    const newCurrentDate = new Date(currentUtcDate.getYear() + 1900, currentUtcDate.getMonth(), currentUtcDate.getDay());
    const nextDate = addDays(currentUtcDate, 1);
    const nextDayDate = new Date(nextDate.getYear() + 1900, nextDate.getMonth(), nextDate.getDay());
    const { Payout, API, sequelize } = await connectToDatabase();
    let payouts = [];
    let i = 0;
    while ((payouts = await Payout.findAll({
        include: [API],
        offset:COUNT * i, 
        limit: COUNT,  
        where: { 
            status: 0, 
            dateType: "on",
            dateValue: {
                [Op.gte]: newCurrentDate,
                [Op.lt]: nextDayDate,
            }
        }
    })).length > 0){
        i = i + 1;
        await updatePayouts(payouts);
    }
    const response = {
        statusCode: 200,
        body: JSON.stringify('Hello from Lambda!'),
    };
    return response;
};
