const Sequelize = require('/opt/node_modules/sequelize');
const Op = Sequelize.Op;
const connectToDatabase = require('/opt/database/db');
const { getUserInfo } = require('/opt/database');
exports.handler = async (event, context, callback) => {
    let accessToken = event.headers['X-Amz-Security-Token']; 
    if (!accessToken){
        accessToken = event.headers['x-amz-security-token'];
    }
    
    const user = await getUserInfo(accessToken); 
    const { Balance, API } = await connectToDatabase();

    const  balances = await Balance.findAll({
        include: [API],
        where: { 
            "$api.companyId$": user.companyId,
        },
    });
    
    const response = {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Allow-Methods': 'OPTIONS, POST, GET, PUT'
          },
        body: JSON.stringify({
            list: balances
        })
    };
    return response;
};
