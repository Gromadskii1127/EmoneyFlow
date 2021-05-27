const { adminDeleteUser } = require('/opt/cognito');
const connectToDatabase = require('/opt/database/db'); 

exports.handler = async (event, context, callback) => {
    try{
    	const id = event.queryStringParameters.id;
    	const { User } = await connectToDatabase();
    	const user = await User.findByPk(id);
    	console.log('id = ', id, user);
    	if (user !== null){
	    	await adminDeleteUser(user.cognitoId);
	    	await User.destroy({ where: { id: parseInt(id, 0)}});
	    	const response = {
	            statusCode: 200,
				headers: {
					'Access-Control-Allow-Origin': '*',
					'Access-Control-Allow-Headers': '*',
					'Access-Control-Allow-Methods': 'OPTIONS, POST, GET, PUT'
				},
	            body: "Successfully Deleted User"
	        };
	        return response;       	
    	}
    	else {
    		return {
    			statusCode: 404,
				headers: {
					'Access-Control-Allow-Origin': '*',
					'Access-Control-Allow-Headers': '*',
					'Access-Control-Allow-Methods': 'OPTIONS, POST, GET, PUT'
				},
    			body: "User not exist"
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
