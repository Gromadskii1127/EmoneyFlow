const { getUserInfo } = require('/opt/database');
exports.handler = async (event, context, callback) => {
    let accessToken = event.headers['X-Amz-Security-Token']; 
    if (!accessToken){
        accessToken = event.headers['x-amz-security-token'];
    }
    const user = await getUserInfo(accessToken);
    // TODO implement
    const response = {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Allow-Methods': 'OPTIONS, POST, GET, PUT'
          },
        body: JSON.stringify(user),
    };
    return response;
};
