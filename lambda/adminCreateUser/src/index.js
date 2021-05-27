const connectToDatabase = require('/opt/database/db');
const { createUser} = require('/opt/database');

exports.handler = async (event, context, callback) => {
    try {
        const body = JSON.parse(event.body);
        const idValue = body.id
        let id = parseInt(body.id, 0);
        const { User, Company } = await connectToDatabase();
        if (typeof idValue === 'string' && idValue.startsWith("added-")) {
            delete body.id;
        }
        const createdUser = await createUser(body);
        id = createdUser.id;
        const user = await User.findOne({ where: { id: id }, include: [Company] });
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
    } catch (err) {
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
