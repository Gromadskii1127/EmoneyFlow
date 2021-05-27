const connectToDatabase = require('/opt/database/db');
exports.handler = async (event, context, callback) => {
    try{
        const { Payee } = await connectToDatabase();
        const id = parseInt(event.queryStringParameters.id, 0);
        if (Number.isNaN(id)) return {statusCode: 404, body: "Wrong Id"}
        await Payee.destroy({where: {id}});
		return {
			statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': '*',
                'Access-Control-Allow-Methods': 'OPTIONS, POST, GET, PUT'
              },
			body: "Successfully Deleted"
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
}