const Sequelize = require('/opt/node_modules/sequelize');
const Op = Sequelize.Op;
const connectToDatabase = require('/opt/database/db');

exports.handler = async (event, context, callback) => {
  try {
    let keyword = "", countPerPage = 10, pageIndex = 0;
    keyword = event.queryStringParameters.hasOwnProperty('keyword') ? event.queryStringParameters.keyword : "";
    countPerPage = event.queryStringParameters.hasOwnProperty('countPerPage') && event.queryStringParameters.countPerPage !== "" ? parseInt(event.queryStringParameters.countPerPage, 0) : 0;
    pageIndex = event.queryStringParameters.hasOwnProperty('pageIndex') && event.queryStringParameters.pageIndex !== "" ? parseInt(event.queryStringParameters.pageIndex, 0) : 0;
    const { Company, API } = await connectToDatabase();

    let condition = {
      include: [{
        model: API,
        attributes: ['status'],
        separate: true
      }],
      where: {
        [Op.or]: [
          {
            firstName: {
              [Op.like]: '%' + keyword + '%'
            }
          },
          {
            lastName: {
              [Op.like]: '%' + keyword + '%'
            }
          },
          {
            email: {
              [Op.like]: '%' + keyword + '%'
            }
          },
          {
            bank: {
              [Op.like]: '%' + keyword + '%'
            }
          },
          {
            iban: {
              [Op.like]: '%' + keyword + '%'
            }
          },
          {
            bic: {
              [Op.like]: '%' + keyword + '%'
            }
          },
          {
            accountNo: {
              [Op.like]: '%' + keyword + '%'
            }
          },
          {
            routingNo: {
              [Op.like]: '%' + keyword + '%'
            }
          }
        ]


      }
    }

    if (countPerPage > 0) {
      condition['limit'] = countPerPage;
    }

    if (pageIndex > 0) {
      condition['offset'] = countPerPage * (pageIndex - 1);
    }
    const result = await Company.findAndCountAll(condition);
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Methods': 'OPTIONS, POST, GET, PUT'
      },
      body: JSON.stringify({ list: result.rows, totalCount: result.count })
    }
  }
  catch (err) {
    return {
      statusCode: err.statusCode || 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Methods': 'OPTIONS, POST, GET, PUT'
      },
      body: JSON.stringify(err)
    }
  }
};
