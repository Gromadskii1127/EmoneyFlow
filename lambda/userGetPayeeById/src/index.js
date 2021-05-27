const connectToDatabase = require('/opt/database/db');

exports.handler = async (event, context, callback) => {
    try {
        const { Payee, Payout } = await connectToDatabase();
        const id = parseInt(event.path.id, 0);
        if (Number.isNaN(id)) return { statusCode: 400, body: "Wrong Id" }
        const payee = await Payee.findOne({ where: { id }, include: [Payout] });
        if (payee) {
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
                statusCode: 201,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': '*',
                    'Access-Control-Allow-Methods': 'OPTIONS, POST, GET, PUT'
                },
                body: { message: 'Not Exist' }
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
            body: JSON.stringify(err)
        }
    }
};
