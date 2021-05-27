const { getCognitoUser, disableMFA, validateMFA } = require('/opt/cognito')

const main = async (event, context, callback) => {
  let accessToken = event.headers['X-Amz-Security-Token'];
  if (!accessToken) {
    accessToken = event.headers['x-amz-security-token'];
  }

  const cognitoUser = await getCognitoUser(accessToken);
  const validated = await validateMFA(event.queryStringParameters.code, accessToken)
  if (validated.Status && validated.Status === 'SUCCESS') {
    await disableMFA(cognitoUser.Username)
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
