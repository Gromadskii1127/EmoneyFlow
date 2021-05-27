const Sequelize = require('/opt/node_modules/sequelize');
const Op = Sequelize.Op;
const connectToDatabase = require('/opt/database/db');
const { getUserInfo } = require('/opt/database');
exports.handler = async (event, context, callback) => {
    try{
        let accessToken = event.headers['X-Amz-Security-Token']; 
        if (!accessToken){
            accessToken = event.headers['x-amz-security-token'];
        }
        const { Payee, Company } = await connectToDatabase();
        const user = await getUserInfo(accessToken);
        const company = await Company.findOne({where: {id: user.companyId}});
        let keyword = "", countPerPage = 0, pageIndex = 0;
        keyword = event.queryStringParameters.hasOwnProperty('keyword') ? event.queryStringParameters.keyword : "";
        countPerPage = event.queryStringParameters.hasOwnProperty('countPerPage') && event.queryStringParameters.countPerPage !== "" ? parseInt(event.queryStringParameters.countPerPage, 0) : 0;
        pageIndex = event.queryStringParameters.hasOwnProperty('pageIndex') && event.queryStringParameters.pageIndex !== "" ? parseInt(event.queryStringParameters.pageIndex, 0) : 0;
        
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
                    },
                    {
                        affiliateId: {
                            [Op.like]: '%' + keyword + '%'    
                        }
                    },
                    {
                        bankName: {
                            [Op.like]: '%' + keyword + '%'    
                        }
                    },
                    
                ],
                
            },
        }
        if (company !== null){
            condition['where']['companyId'] = company.id;
        }
        const totalCount = await Payee.count(condition)
        if (countPerPage > 0){
            condition['limit'] = countPerPage;
        }
        
        if (pageIndex > 0) {
            condition['offset'] = countPerPage * (pageIndex - 1);
        }
        const list = await Payee.findAll(condition);
        console.log('list = ')
        return {
			statusCode: 200,
			headers: {
			    'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': '*',
                'Access-Control-Allow-Methods': 'OPTIONS, POST, GET, PUT'
			},
			body: JSON.stringify({list: list, totalCount: totalCount}),
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