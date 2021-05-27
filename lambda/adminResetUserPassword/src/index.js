const connectToDatabase = require('/opt/database/db'); 
const { adminUserResetPassword } = require('/opt/cognito');
exports.handler = async (event, context, callback) => {    
    try{        
        const body = JSON.parse(event.body);
        let id = parseInt(body.id);
        console.log('id = ', id);
        const { User } = await connectToDatabase();
        const user = await User.findOne({where: { id: id}});        
        if (user !== null){            
            await adminUserResetPassword(user.cognitoId)
            return {
                statusCode: 200,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': '*',
                    'Access-Control-Allow-Methods': 'OPTIONS, POST, GET, PUT'
                },
                body: "Sent Forgot Password Email. Please check on your inbox"
            }
        } else {
            return {
                statusCode: 401,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': '*',
                    'Access-Control-Allow-Methods': 'OPTIONS, POST, GET, PUT'
                },
                body: " User does not exist"
            }
        }
    } catch(err){
        return {
			statusCode: err.statusCode || 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': '*',
                'Access-Control-Allow-Methods': 'OPTIONS, POST, GET, PUT'
            },
			body: JSON.stringify(err)
		}
    }
    
};
