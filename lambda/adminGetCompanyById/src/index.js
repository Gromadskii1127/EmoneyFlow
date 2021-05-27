const connectToDatabase = require('/opt/database/db');

exports.handler = async (event, context, callback) => { 
    try{
        const { Company, API, User } = await connectToDatabase();      
        const path = event.pathParameters;
        const id = parseInt(path.id, 0);
        if (Number.isNaN(id)) return {statusCode: 400, body: "Wrong Id"}
        const company = await Company.findOne({where: {id}, 
            include: [
            {
              model: API
            },
            {
                model: User
            },
            ],
        });
		return {
			statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': '*',
                'Access-Control-Allow-Methods': 'OPTIONS, POST, GET, PUT'
            },
			body: JSON.stringify(company)
		}
    }
    catch(err)
    {
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
