const Sequelize = require('/opt/node_modules/sequelize');
const Op = Sequelize.Op;
const connectToDatabase = require('/opt/database/db');
const { getUserInfo } = require('/opt/database');
const { addDays, format } = require("/opt/node_modules/date-fns");
const days = 7;

exports.handler = async (event, context, callback) => {
    let accessToken = event.headers['X-Amz-Security-Token']; 
    if (!accessToken){
        accessToken = event.headers['x-amz-security-token'];
    }
    const user = await getUserInfo(accessToken); 
    const { Payout, sequelize } = await connectToDatabase();
    
    const last7Date =  addDays(new Date(), -days); 
    const last7DateString = format(last7Date, 'yyyy-MM-dd')
    
    
    let latestSuccessPayout = { amount: 0, percentage: 0, currency: 'EUR'};
    let latestPendingPayout = { amount: 0, percentage: 0, currency: 'EUR'};
    let latestErrorPayout = { amount: 0, percentage: 0, currency: 'EUR'};
    let totalSuccess = 0, totalPending = 0, totalError = 0;
    let latest7Success = { amount: 0, percentage: 0, currency: 'EUR' }
    let latest7Pending = { amount: 0, percentage: 0, currency: 'EUR' }
    let latest7Error = { amount: 0, percentage: 0, currency: 'EUR' }
    const totalPromises = [];
    totalPromises.push(Payout.findAll({ 
        attributes:[
          [sequelize.fn('sum', sequelize.col('amount')), 'total_amount']  
        ],
        where: { 
            userId: user.id,
            status: 1,
            currency: 'EUR'
        },
    }).then(payouts => {
        if (payouts.length > 0 && payouts[0]['total_amount']){
            totalSuccess = payouts[0]['total_amount'];    
        }
        
    }));
    
    totalPromises.push(Payout.findAll({ 
        attributes:[
          [sequelize.fn('sum', sequelize.col('amount')), 'total_amount']  
        ],
        where: { 
            userId: user.id,
            status: 3,
            currency: 'EUR'
        },
    }).then(payouts => {
        if (payouts.length > 0 && payouts[0]['total_amount']){
            totalPending = payouts[0]['total_amount'];    
        }
        
    }));
    totalPromises.push(Payout.findAll({ 
        attributes:[
          [sequelize.fn('sum', sequelize.col('amount')), 'total_amount']  
        ],
        where: { 
            userId: user.id,
            status: 2,
            currency: 'EUR'
        },
    }).then(payouts => {
        if (payouts.length > 0 && payouts[0]['total_amount']){
            totalError = payouts[0]['total_amount'];    
        }
    }));
    await Promise.all(totalPromises);
    const promises = [];
    promises.push(Payout.findOne({ where: { 
            userId: user.id,
            status: 1,
            currency: 'EUR'
        },
        order: [
            ['createdAt', 'ASC']
        ],
        limit: 1
    }).then(last => {
        if (last){
            latestSuccessPayout = { amount: last.amount, percentage: 0, currency: last.currency}
        }
    }))
    
    promises.push(Payout.findOne({ where: { 
            userId: user.id,
            status: 3, // pending
            currency: 'EUR'
        },
        order: [
            ['createdAt', 'ASC']
        ],
        limit: 1
    }).then(last => {
        if (last){
            latestPendingPayout = { amount: last.amount, percentage: 0, currency: last.currency}
        }
    }));
    promises.push(Payout.findOne({ where: { 
            userId: user.id,
            status: 2, // error
            currency: 'EUR'
        },
        order: [
            ['createdAt', 'ASC']
        ],
        limit: 1
    }).then(last => {
        if (last){
            latestErrorPayout = { amount: last.amount, percentage: 0, currency: last.currency}
        }
    }));
    
    
    promises.push(Payout.findAll({ 
        attributes:[
          [sequelize.fn('sum', sequelize.col('amount')), 'total_amount']  
        ],
        where: { 
            userId: user.id,
            status: 1,
            currency: 'EUR',
            createdAt: {
                [Op.gte]: Date.parse(last7DateString)
            }
        },
    }).then(payouts => {
        if (payouts.length > 0 && payouts[0]['total_amount'] && totalSuccess > 0){
            latest7Success = { amount: payouts[0]['total_amount'], currency: 'EUR', percentage: payouts[0]['total_amount'] / totalSuccess} ;    
        }
    }));
    promises.push(Payout.findAll({ 
        attributes:[
          [sequelize.fn('sum', sequelize.col('amount')), 'total_amount']  
        ],
        where: { 
            userId: user.id,
            status: 3,
            currency: 'EUR',
            createdAt: {
                [Op.gte]: Date.parse(last7DateString)
            }
        },
    }).then(payouts => {
        if (payouts.length > 0 && payouts[0]['total_amount'] && totalPending > 0){
            latest7Pending = { amount: payouts[0]['total_amount'], currency: 'EUR', percentage: payouts[0]['total_amount'] / totalPending} ;    
        }
    }));
    
    promises.push(Payout.findAll({ 
        attributes:[
          [sequelize.fn('sum', sequelize.col('amount')), 'total_amount']  
        ],
        where: { 
            userId: user.id,
            status: 2,
            currency: 'EUR',
            createdAt: {
                [Op.gte]: Date.parse(last7DateString)
            }
        },
    }).then(payouts => {
        if (payouts.length > 0 && payouts[0]['total_amount'] && totalError > 0){
            latest7Error = { amount: payouts[0]['total_amount'], currency: 'EUR', percentage: payouts[0]['total_amount'] / totalPending} ;    
        }
    }));
    
    await Promise.all(promises);
    const response = {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Allow-Methods': 'OPTIONS, POST, GET, PUT'
          },
        body: JSON.stringify({
            lastTransactionSuccess: latestSuccessPayout,
            lastTransactionPending: latestPendingPayout,
            lastTransactionError: latestErrorPayout,
            lastSevenDaysSuccess: latest7Success,
            lastSevenDaysPending: latest7Pending,
            lastSevenDaysError: latest7Error,
        })
    };
    return response;
};
