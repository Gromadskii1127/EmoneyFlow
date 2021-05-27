const connectToDatabase = require('/opt/database/db'); 
const { createCongnitoUser, updateAttributeCognitoUser, adminConfirmSignUp } = require('/opt/cognito');

const DefaultPassword = 'Password1!';
const DefaultAdminName = 'Admin';
exports.handler = async (event) => {
    const email = process.env.SUPERUSER_NAME;
    const password = process.env.SUPERUSER_PASSWORD || DefaultPassword;
    const cUser = await createCongnitoUser({ email: email, password: password });
    await adminConfirmSignUp(cUser.UserSub);
    const attributes = [];
    attributes.push({name: 'custom:userType', value: '1'});
    attributes.push({name: 'email_verified', value: 'true'});
    await updateAttributeCognitoUser({sub: cUser.UserSub, attributes: attributes})
    const { User } = await connectToDatabase();
    let userRow = User.build({});
    userRow['cognitoId'] = cUser.UserSub;    
    userRow['email'] = email;
    userRow['firstName'] = DefaultAdminName;
    userRow['userType'] = 1;
    await userRow.save(); 
    const response = {
        statusCode: 200,
        body: JSON.stringify('Created Super User'),
    };
    return response;
}