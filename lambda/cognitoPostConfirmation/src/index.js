const { createUsagePlanKey, generateApiKey, saveApiKey } = require('/opt/cognito');



const main = async (event, context, callback) => {
  if (event.triggerSource == 'PostConfirmation_ConfirmSignUp') {
    const { sub } = event.request.userAttributes
    const { id, value: apikey } = await generateApiKey(sub)
    await createUsagePlanKey(id)
    await saveApiKey(sub, apikey)
  }

  return event
}

exports.handler = main
