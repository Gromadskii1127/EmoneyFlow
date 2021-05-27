exports.handler = (event, context, callback) => {
    console.log('context :', JSON.stringify(context, null, 2));
    console.log('Received event:', JSON.stringify(event, null, 2));
    if (event.triggerSource === "CustomMessage_ForgotPassword") {
        event.response.emailMessage = 'Welcome to the EmoneyFlow. Your link: http://localhost:3000/user/newpwd?code=' + event.request.codeParameter + '&email=' + event.request.userAttributes.email;
        event.response.emailSubject = 'Forgot Password'
    }
    console.log('Received event:', JSON.stringify(event, null, 2));
    // context.done(null, event);
    callback(null, event);
};