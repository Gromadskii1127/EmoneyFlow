const connectToDatabase = require('/opt/database/db');
const { getUserInfo } = require('/opt/database');
const { updateAttributeCognitoUser, changePassword } = require('/opt/cognito');

exports.handler = async (event, context, callback) => {
    try {
        const user = JSON.parse(event.body)
        // TODO implement
        const { User } = await connectToDatabase();
        let accessToken = event.headers['X-Amz-Security-Token'];
        if (!accessToken) {
            accessToken = event.headers['x-amz-security-token'];
        }
        const mUser = await getUserInfo(accessToken);
        console.log('mUser = ', mUser)
        delete user.id;
        console.log('user = ', user)
        if (user.companyId === 0) {
            user.companyId = null;
        }
        const result = await User.update(user, { where: { id: mUser.id } });
        const updatedUser = await User.findOne({ where: { id: mUser.id } });
        
        
        const cognitoResult = await updateAttributeCognitoUser({
            sub: mUser.cognitoId,
            attributes: [{ name: 'family_name', value: user.firstName },
            { name: 'given_name', value: user.lastName },
            { name: 'email', value: user.email }]
        });
        if (user.password && user.password !== "") {
            await changePassword(accessToken, user.opassword, user.password);
        }
        const response = {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': '*',
                'Access-Control-Allow-Methods': 'OPTIONS, POST, GET, PUT'
            },
            body: JSON.stringify(updatedUser)
        };
        return response;
    } catch (error) {
        const response = {
            statusCode: 400,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': '*',
                'Access-Control-Allow-Methods': 'OPTIONS, POST, GET, PUT'
            },
            body: JSON.stringify(error)
        }
        return response;
    }

};
