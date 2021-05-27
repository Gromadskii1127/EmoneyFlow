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
  let days = 1; let count = 5;

  try {
    days = parseInt(event.queryStringParameters.days)
    count = parseInt(event.queryStringParameters.count);
  } catch (err) {

  }


  const lastDays = addDays(new Date(), -days);
  const lastDaysString = format(lastDays, 'yyyy-MM-dd')

  const beforeLastDays = addDays(new Date(), -days * 2);
  const beforelastDaysString = format(lastDays, 'yyyy-MM-dd')
  const user = await getUserInfo(accessToken);
  const { Payee, Payout, sequelize } = await connectToDatabase();

  const payouts = await Payout.findAll({
    include: [Payee],

    group: ['payeeId'],
    attributes: [
      'id',
      'currency',
      'createdAt',
      'status',
      'payeeId',
      [sequelize.fn('sum', sequelize.col('amount')), 'total_amount'],
    ],
    where: {
      companyId: user.companyId,
      createdAt: {
        [Op.gte]: Date.parse(lastDaysString),
      },
      //status: 1,
    },
    order: [[sequelize.literal('total_amount'), 'DESC']],
    limit: count
  });

  const lastPayouts = await Payout.findAll({
    include: [Payee],
    group: ['payeeId'],
    attributes: [
      'id',
      'currency',
      'createdAt',
      'status',
      'payeeId',
      [sequelize.fn('sum', sequelize.col('amount')), 'total_amount'],
    ],
    where: {
      companyId: user.companyId,
      createdAt: {
        [Op.gte]: Date.parse(beforelastDaysString),
        [Op.lt]: Date.parse(lastDaysString),

      },
      //status: 1,
    },
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
      last: lastPayouts,
      days: days
    })
  };
  return response;
};
