const Sequelize = require('/opt/node_modules/sequelize');
const Op = Sequelize.Op; 
const connectToDatabase = require('/opt/database/db'); 

exports.handler = async (event, context, callback) => {
    try{
        let keyword = "", countPerPage = 10, pageIndex = 0;
        keyword = event.queryStringParameters.hasOwnProperty('keyword') ? event.queryStringParameters.keyword : "";
        countPerPage = event.queryStringParameters.hasOwnProperty('countPerPage') && event.queryStringParameters.countPerPage !== "" ? parseInt(event.queryStringParameters.countPerPage, 0) : 0;
        pageIndex = event.queryStringParameters.hasOwnProperty('pageIndex') && event.queryStringParameters.pageIndex !== "" ? parseInt(event.queryStringParameters.pageIndex, 0) : 0;
        console.log('data =')
        const { User, Company } = await connectToDatabase();
        let condition = {
            where: {
                [Op.or]: [
                    {
                        firstName: {
                            [Op.like]: '%' + keyword + '%'    
                        }
                    },
                    {
                        lastName: {
                            [Op.like]: '%' + keyword + '%'    
                        }
                    },
                    {
                        email: {
                            [Op.like]: '%' + keyword + '%'    
                        }
                    }
                    
                ],
                userType: 0
                
                
            },
            include: [Company]
        }
        const totalCount = await User.count(condition)
        if (countPerPage > 0){
            condition['limit'] = countPerPage;
        }
        
        if (pageIndex > 0) {
            condition['offset'] = countPerPage * (pageIndex - 1);
        }
        console.log('condition = ',condition)
        const userList = await User.findAll(condition);
        
        console.log('userList = ', userList)
        const response = {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': '*',
                'Access-Control-Allow-Methods': 'OPTIONS, POST, GET, PUT'
            },
            body: JSON.stringify({list: userList, totalCount: totalCount}),
        };
        return response;
    	
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
