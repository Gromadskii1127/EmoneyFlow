const connectToDatabase = require('/opt/database/db'); 
const { updateUser } = require('/opt/database');

exports.handler = async (event, context, callback) => {
    // TODO implement
    try{
        const body = JSON.parse(event.body);        
        if (body['companyId'] === 0) {
            body['companyId'] = null;
        }
        console.log('body = ', body)
        const idValue = body.id
        let id = parseInt(body.id, 0); 
        if (id === 0 )       {
            return {
                statusCode: 404,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': '*',
                    'Access-Control-Allow-Methods': 'OPTIONS, POST, GET, PUT'
                },
                body: JSON.stringify('Error')
            }
        }
        const { User, Company } = await connectToDatabase();
        await updateUser(body)
        const user = await User.findOne({ where: { id: id}, include: [Company]});
        const response = {
                statusCode: 200,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': '*',
                    'Access-Control-Allow-Methods': 'OPTIONS, POST, GET, PUT'
                },
                body: JSON.stringify({ user: user, original: idValue})
        };
        return response;       
    } catch(err){
        console.log('error = ', err)
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
