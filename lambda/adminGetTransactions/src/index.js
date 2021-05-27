const { searchDocument, countDocument } = require('/opt/elastic/elasticservice');
const { getUserInfo } = require('/opt/database');
const makeQuery = (event, user) => {
  const keyword = event.queryStringParameters.hasOwnProperty('keyword') ? event.queryStringParameters.keyword : "",
    fromDate = event.queryStringParameters.hasOwnProperty('fromDate') ? event.queryStringParameters.fromDate : "",
    toDate = event.queryStringParameters.hasOwnProperty('toDate') ? event.queryStringParameters.toDate : "",
    currency = event.queryStringParameters.hasOwnProperty('currency') ? event.queryStringParameters.currency : "",
    status = event.queryStringParameters.hasOwnProperty('status') && event.queryStringParameters.status !== "" ? event.queryStringParameters.status : '',
    method = event.queryStringParameters.hasOwnProperty('method') && event.queryStringParameters.method !== "" ? parseInt(event.queryStringParameters.method) : -1;
  const mustQuery = [];
  if (method > -1) {
    mustQuery.push({ match: { "payee.method": method } });
  }
  if (status !== '') {
    mustQuery.push({ match: { state: status + "*" } });
  }

  if (user) {
    if (user.status === 0) {
      mustQuery.push({ match: { companyId: user.companyId } });
    }

  }

  if (keyword !== "") {
    const keywordShouldQuery = [];
    keywordShouldQuery.push({ wildcard: { "payee.iban": "*" + keyword + "*" } });
    keywordShouldQuery.push({ wildcard: { "payee.lastName": "*" + keyword + "*" } });
    keywordShouldQuery.push({ wildcard: { "payee.firstName": "*" + keyword + "*" } });
    mustQuery.push({ bool: { should: keywordShouldQuery } });
  }
  const range = {
    "range": {
      "createdAt": {}
    }

  }
  if (fromDate !== "") {
    range["range"]["createdAt"]["gte"] = fromDate;
  }
  if (toDate !== "") {
    range["range"]["createdAt"]["lte"] = toDate;
  }
  if (Object.keys(range.range.createdAt).length > 0)
    mustQuery.push(range);
  return mustQuery;
}
exports.handler = async (event, context, callback) => {

  let accessToken = event.headers['X-Amz-Security-Token'];
  if (!accessToken) {
    accessToken = event.headers['x-amz-security-token'];
  }
  const user = await getUserInfo(accessToken);

  let countPerPage = 10, pageIndex = 1, isCalc = false;
  countPerPage = event.queryStringParameters.hasOwnProperty('countPerPage') && event.queryStringParameters.countPerPage !== "" ? parseInt(event.queryStringParameters.countPerPage, 0) : 0;
  pageIndex = event.queryStringParameters.hasOwnProperty('pageIndex') && event.queryStringParameters.pageIndex !== "" ? parseInt(event.queryStringParameters.pageIndex, 0) : 1;
  pageIndex = pageIndex > 0 ? pageIndex : 1;
  isCalc = event.queryStringParameters.hasOwnProperty('isCalc') && event.queryStringParameters.isCalc === 'true';
  const query = { query: { bool: { must: makeQuery(event, user) } } };

  if (isCalc) {
    const aggs = {};
    aggs["total_price"] = {
      "sum": {
        "field": "amount"
      }
    }
    aggs["fee_price"] = {
      "sum": {
        "field": "api.amount"
      }
    }

    query["aggs"] = aggs;

    const queriesResult = await Promise.all([searchDocument(query), searchDocument({ aggs: aggs })]);
    const totalSubResult = queriesResult[0];
    const totalResult = queriesResult[1];

    const totalPrice = totalResult.aggregations.total_price.value;
    const totalFeePrice = totalResult.aggregations.fee_price.value;

    const totalSubPrice = totalSubResult.aggregations.total_price.value;
    const totalSubFeePrice = totalSubResult.aggregations.total_price.value;
    const calcAmount = {
      totalPrice: totalPrice,
      totalCount: totalResult.data.hits.total.value,
      totalFeePrice: totalFeePrice,
      queryPrice: totalSubPrice,
      queryCount: totalSubResult.data.hits.total.value,
      queryFeePrice: totalSubFeePrice
    }
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Methods': 'OPTIONS, POST, GET, PUT'
      },
      body: JSON.stringify({ data: result, totalCount: count.count, calcAmount: calcAmount })
    };

  } else {
    const result = await searchDocument(query, (pageIndex - 1) * countPerPage, countPerPage);
    const response = {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Methods': 'OPTIONS, POST, GET, PUT'
      },
      body: JSON.stringify({ data: result, totalCount: result.data.hits.total.value })
    };
    return response;
  }
}