const axios = require('/opt/node_modules/axios');
const connectToDatabase = require('/opt/database/db');
const { getUserInfo } = require('/opt/database');
const { createSepaPayment } = require('/opt/sepa');
const { indexDocument, updateDocument } = require('/opt/elastic/elasticservice');

const { checkApiAndGetToken, updatePayout} = require('/opt/database');
exports.handler = async (event, context, callback) => {
    const body = event.body;
    const payoutDatas = JSON.parse(body);
    let accessToken = event.headers['X-Amz-Security-Token'];
    if (!accessToken) {
        accessToken = event.headers['x-amz-security-token'];
    }
    try {
        const { Payout, Payee, API, Company } = await connectToDatabase();
        const user = await getUserInfo(accessToken);
        let ret = [];
        let promises = [];
        if (Array.isArray(payoutDatas)) {
            const updatedPayouts = [];
            for (var i = 0; i < payoutDatas.length; i++) {
                const payoutData = payoutDatas[i];
                const payeeId = payoutData.payeeId;
                const payee = await Payee.findByPk(payeeId);

                if (payee === null) {
                    payoutData['statusCode'] = 4;
                    payoutData['message'] = 'Failed to get related payee';
                    updatedPayouts.push(payoutData);
                    continue;
                }
                if (payoutData.dateType === "on") {
                    const nowDate = new Date();
                    const newDate = new Date(payoutData.dateValue);
                    if (nowDate >= newDate) {
                        payoutData.dateType = "today";
                    }
                }
                const payout = Payout.build(payoutData);

                const rApi = await API.findOne({ where: [{ apiType: payee.method }, { companyId: user.companyId }] })
                if (rApi === null)
                    return {
                        statusCode: 400,
                        headers: {
                            'Access-Control-Allow-Origin': '*',
                            'Access-Control-Allow-Headers': '*',
                            'Access-Control-Allow-Methods': 'OPTIONS, POST, GET, PUT'
                        },
                        body: JSON.stringify("Your don't have correct API Method.") 
                    }
                try {
                    payout.companyId = user.companyId;
                    payout.userId = user.id;
                    payout.method = payee.method;
                    payout.currency = payee.currency;
                    payout.apiId = rApi && rApi.id ? rApi.id : '';
                    await payout.save();
                } catch (ex) {
                    console.log('ex = ', ex)
                }
                console.log('payout id = ', payout.id);
                const newPayout = await Payout.findOne({ include: [Payee, Company, API], where: { id: payout.id } });
                if (newPayout !== null) {
                    const result = await indexDocument(payout.id, newPayout);
                }

                if (payoutData.dateType !== "today") {
                    newPayout['statusCode'] = 201;
                    newPayout['message'] = 'Created and Scheduled';
                    updatedPayouts.push(newPayout);
                    continue;
                }
                const api = await checkApiAndGetToken(payee.method, user.companyId);

                if (api === null) {
                    payoutData['statusCode'] = 0;
                    payoutData['message'] = 'Failed to get api token for this payout';
                    updatedPayouts.push(payoutData);
                    continue;
                }
                if (api.token) {
                    if (payout.method === 0) {
                        promises.push(createSepaPayment(api, payee, payout).then(async (response) => {
                            if (response.success) {
                                const updated = await updatePayout(Payout, Payee, response.id, response.data.data);
                                const result = await updateDocument(updated.id, updated);
                                updated['statusCode'] = 200;
                                updated['message'] = '';
                                updatedPayouts.push(updated);
                            } else {
                                const mPayout = await Payout.findOne({ where: { id: response.id }, include: [Payee] })
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
                } catch (ex) {
                    console.log('error = ', ex);
                    return 'error ' + JSON.stringify(ex);
                }
            }

            const response = {
                statusCode: 200,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': '*',
                    'Access-Control-Allow-Methods': 'OPTIONS, POST, GET, PUT'
                },
                body: JSON.stringify(updatedPayouts),
            };
            return response;
        } else {
            const response = {
                statusCode: 400,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': '*',
                    'Access-Control-Allow-Methods': 'OPTIONS, POST, GET, PUT'
                },
                body: JSON.stringify('Input Parameter is invalid'),
            };
            return response;
        }
    } catch (err) {
        const response = {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': '*',
                'Access-Control-Allow-Methods': 'OPTIONS, POST, GET, PUT'
            },
            body: JSON.stringify(err)
        };
        return response;
    }


};
