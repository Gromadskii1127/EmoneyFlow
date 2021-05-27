const { validateMFA, enableMFA } = require('/opt/cognito')

const main = async (event, context, callback) => {
  let accessToken = event.headers['X-Amz-Security-Token'];
  if (!accessToken) {
    accessToken = event.headers['x-amz-security-token'];
  }
  const result = await validateMFA(event.body.code, accessToken)


  if (result.Status && result.Status === 'SUCCESS') {
    await enableMFA(accessToken);
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
'Access-Control-Allow-Headers': '*',
'Access-Control-Allow-Methods': 'OPTIONS, POST, GET, PUT'
      },
      body: 'success'
    }
  }

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
'Access-Control-Allow-Headers': '*',
'Access-Control-Allow-Methods': 'OPTIONS, POST, GET, PUT'
    },
    body: 'success'
  }
}

exports.handler = main
