const { searchDocument, countDocument } = require('/opt/elastic/elasticservice');
const { getUserInfo } = require('/opt/database');

const makeQuery = (event, user) => { 
    const keyword = event.queryStringParameters.hasOwnProperty('keyword') ? event.queryStringParameters.keyword : "",
    fromDate = event.queryStringParameters.hasOwnProperty('fromDate') ? event.queryStringParameters.fromDate : "", 
    toDate = event.queryStringParameters.hasOwnProperty('toDate') ? event.queryStringParameters.toDate : "", 
    currency = event.queryStringParameters.hasOwnProperty('currency') ? event.queryStringParameters.currency : "", 
    payeeId = event.queryStringParameters.hasOwnProperty('payeeId') && event.queryStringParameters.payeeId !== "" ? parseInt(event.queryStringParameters.payeeId) : -1,
    status = event.queryStringParameters.hasOwnProperty('status') && event.queryStringParameters.status !== "" ? parseInt(event.queryStringParameters.status) : -1,
    method = event.queryStringParameters.hasOwnProperty('method') && event.queryStringParameters.method !== "" ? parseInt(event.queryStringParameters.method) : -1;
    const mustQuery = [];
    if (method > -1){
        mustQuery.push({match: {"payee.method": method}});
    }
    if (status > -1) {
        mustQuery.push({match: {status: status}});
    }
    
    if (payeeId > 0) {
        mustQuery.push({match: { payeeId: payeeId}});
    }
    if (user.companyId > 0){
        mustQuery.push({match: {companyId: user.companyId}});
    }
    mustQuery.push({match: {userId: user.id}});

    if (keyword !== ""){
        const keywordShouldQuery = [];
        keywordShouldQuery.push({wildcard: {"payee.iban": "*" + keyword + "*"}});
        keywordShouldQuery.push({wildcard: {"payee.lastName": "*" + keyword + "*"}});
        keywordShouldQuery.push({wildcard: {"payee.firstName": "*" + keyword + "*"}});
        mustQuery.push({bool: { should: keywordShouldQuery}});
    }
    const range = { }
    if (fromDate !== ""){
        range["range"]["createdAt"]["gte"] = fromDate;
    }
    if (toDate !== ""){
        range["range"]["createdAt"]["lte"] = toDate;
    }
    if (Object.keys(range).length > 0)
        mustQuery.push(range);
    return mustQuery;
}
exports.handler = async (event, context, callback) => {
    let accessToken = event.headers['X-Amz-Security-Token']; 
    if (!accessToken){
        accessToken = event.headers['x-amz-security-token'];
    }
    
    const user = await getUserInfo(accessToken);
    
    let countPerPage = 10, pageIndex = 1, isCalc = false;
    countPerPage = event.queryStringParameters.hasOwnProperty('countPerPage') && event.queryStringParameters.countPerPage !== "" ? parseInt(event.queryStringParameters.countPerPage, 0) : 0;
    pageIndex = event.queryStringParameters.hasOwnProperty('pageIndex') && event.queryStringParameters.pageIndex !== "" ? parseInt(event.queryStringParameters.pageIndex, 0) : 1;
    pageIndex = pageIndex > 0 ? pageIndex : 1;
    isCalc = event.queryStringParameters.hasOwnProperty('isCalc') && event.queryStringParameters.isCalc === 'true';
    const query = {query: { bool: { must: makeQuery(event, user)}} };
    const result = await searchDocument( query, (pageIndex -1) * countPerPage, countPerPage)
    const count = await countDocument(query);
    
    const aggs = { };
    if (isCalc) {

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
        const totalSubResult = await searchDocument( query );
        
        const total_count = await countDocument()
        const new_query = {
            query: {
                bool: {
                    must: {
                        match : {
                            companyId: user.companyId
                        }
                    }
                }
            }
        }
        new_query["aggs"] = aggs;
        const totalResult = await searchDocument(new_query)
        
        const totalPrice = totalResult.aggregations.total_price.value;
        const totalFeePrice = totalResult.aggregations.fee_price.value;
        
        const totalSubPrice = totalSubResult.aggregations.total_price.value;
        const totalSubFeePrice = totalSubResult.aggregations.total_price.value;
        const calcAmount = {
            totalPrice: totalPrice,
            totalCount: total_count.count,
            totalFeePrice: totalFeePrice,
            queryPrice: totalSubPrice,
            queryCount: count.count,
            queryFeePrice: totalSubFeePrice
        }
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': '*',
                'Access-Control-Allow-Methods': 'OPTIONS, POST, GET, PUT'
              },
            body: JSON.stringify({ data: result, totalCount: count.count, calcAmount: calcAmount})
        };
        
    } else {
        const response = {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': '*',
                'Access-Control-Allow-Methods': 'OPTIONS, POST, GET, PUT'
              },
            body: JSON.stringify({ data: result, totalCount: count.count})
        };
        return response;    
    }
}