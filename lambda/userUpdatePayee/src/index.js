const connectToDatabase = require('/opt/database/db');
exports.handler = async (event, context, callback) => {
    try {
        const { Payee } = await connectToDatabase();
        const body = event.body;
        const id = parseInt(event.queryStringParameters.id, 0);
        if (id > 0 && !Number.isNaN(id)) {
            delete body.id;
            await Payee.update(body, { where: { id } });
            const payee = Payee.findOne({ where: { id } });
            return {
                statusCode: 200,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': '*',
                    'Access-Control-Allow-Methods': 'OPTIONS, POST, GET, PUT'
                },
                body: JSON.stringify(payee)
            }
        }
        else {
            return {
                statusCode: 404,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': '*',
                    'Access-Control-Allow-Methods': 'OPTIONS, POST, GET, PUT'
                },
                body: "Wrong Id"
            }
        }

    }
    catch (err) {
        return {
            statusCode: err.statusCode || 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': '*',
                'Access-Control-Allow-Methods': 'OPTIONS, POST, GET, PUT'
            },
            body: err
        }
    }
}