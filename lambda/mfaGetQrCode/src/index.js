const { getQRCode } = require('/opt/cognito');
const main = async (event, context, callback) => {
  let accessToken = event.headers['X-Amz-Security-Token']; 
  if (!accessToken){
      accessToken = event.headers['x-amz-security-token'];
  }
  var ret = await getQRCode(accessToken);
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': '*',
      'Access-Control-Allow-Methods': 'OPTIONS, POST, GET, PUT'
    },
    body: JSON.stringify(ret)
  }
}

exports.handler = main
