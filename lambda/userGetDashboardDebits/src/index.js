const Sequelize = require('/opt/node_modules/sequelize');
const Op = Sequelize.Op;
const connectToDatabase = require('/opt/database/db');
const { getUserInfo } = require('/opt/database');
const { parse, addMonths } = require("/opt/node_modules/date-fns");

exports.handler = async (event, context, callback) => {
    let accessToken = event.headers['X-Amz-Security-Token'];
    if (!accessToken) {
        accessToken = event.headers['x-amz-security-token'];
    }
    const from = event.queryStringParameters.fromDate;
    const to = event.queryStringParameters.toDate;

    const fromDate = parse(from, 'yyyy-MM-dd', new Date());
    const toDate = parse(to, 'yyyy-MM-dd', new Date());
    const fromFirstDate = new Date(fromDate.getYear() + 1900, fromDate.getMonth(), 0);
    let toFirstDate = new Date(toDate.getYear() + 1900, toDate.getMonth(), 0);
    toFirstDate = addMonths(toFirstDate, 2)
    toFirstDate = new Date(toFirstDate.getYear() + 1900, toFirstDate.getMonth(), 0);

    const user = await getUserInfo(accessToken);
    const { Payout, Payee, sequelize } = await connectToDatabase();

    const payouts = await Payout.findAll({
        order: [[sequelize.literal('"createdOn"'), 'ASC']],
        group: 'createdOn',
        attributes: [
            'amount', 'status', 'method', 'dateType', 'currency', 'dateValue', 'createdAt',
            [sequelize.fn('sum', sequelize.col('amount')), 'total'],
            [sequelize.fn('date_format', sequelize.col('createdAt'), '%Y-%m-%d'), 'createdOn']
        ],
        where: {
            companyId: user.companyId,
            createdAt: {
                [Op.gte]: fromFirstDate,
                [Op.lt]: toFirstDate,
            }
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
            list: payouts
        })
    };
    return response;
};
