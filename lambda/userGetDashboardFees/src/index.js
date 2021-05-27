const Sequelize = require('/opt/node_modules/sequelize');
const Op = Sequelize.Op;
const connectToDatabase = require('/opt/database/db');
const { getUserInfo } = require('/opt/database');
const { addDays, format } = require("/opt/node_modules/date-fns");

exports.handler = async (event, context, callback) => {

    let accessToken = event.headers['X-Amz-Security-Token'];
    if (!accessToken) {
        accessToken = event.headers['x-amz-security-token'];
    }
    const user = await getUserInfo(accessToken);
    const { API, Payout, sequelize } = await connectToDatabase();
    let days = 1;

    try {
        days = event.body.days
    } catch (err) {

    }
    const lastDays = addDays(new Date(), -days);
    const lastDaysString = format(lastDays, 'yyyy-MM-dd')

    const payouts = await Payout.findAll({
        include: [API],
        group: ['apiId'],
        attributes: [
            'id',
            'currency',
            'method',
            [sequelize.fn('count', sequelize.col('payout.id')), 'count'],
            [sequelize.literal('count(`payout`.id) * `api`.amount'), 'total_amount']
        ],
        where: {
            companyId: user.companyId,
            updatedAt: {
                [Op.gte]: Date.parse(lastDaysString),
            }
        }
    })
    const response = {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Allow-Methods': 'OPTIONS, POST, GET, PUT'
        },
        body: JSON.stringify({
            list: payouts,
        })
    };
    return response;
};
