
const connectToDatabase = require('/opt/database/db');
const { getUserInfo } = require('/opt/database');

exports.handler = async (event, context, callback) => { 
    //return JSON.stringify(event);
    let accessToken = event.headers['X-Amz-Security-Token']; 
    if (!accessToken){
        accessToken = event.headers['x-amz-security-token'];    
    }
    
    
    const payeeDatas = JSON.parse(event.body);
    console.log('body = ', payeeDatas)
    try{
        const { Payee, Company } = await connectToDatabase();
        const user = await getUserInfo(accessToken);
        const company = await Company.findOne({where: {id: user.companyId}});
        let ret = [];
        if (Array.isArray(payeeDatas)) {
            for(var i = 0 ; i < payeeDatas.length; i++ ){
                const payeeData = payeeDatas[i];
                try {
                    if (company !== null){
                        payeeData['companyId'] = company.id;    
                    }
                    if (payeeData.hasOwnProperty('id') && payeeData.id > 0){
                        const payeeId = payeeData.id;
                        delete payeeData.id;
                        const result = await Payee.update(payeeData, {where: { id: payeeId}});
                        const updatedPayee = await Payee.findOne({ where: { id: payeeId}});
                        ret.push({data: updatedPayee, status: 1, message: ''});
                        
                    } else {
                        const payee = Payee.build(payeeData);
                        await payee.save();    
                        ret.push({data: payee, status: 1, message: ''});      
                    }
                    
                    
                } catch (err) {
                    payeeData['status'] = 1;
                    payeeData['message'] = '';
                    ret.push({data: payeeData, status: 0, message: err});
                }
                
            };
            const response = {
                statusCode: 200,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': '*',
                    'Access-Control-Allow-Methods': 'OPTIONS, POST, GET, PUT'
                },
                body: JSON.stringify(ret)
            }                
            return response;
        } else {
            const response = {
                statusCode: 500,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': '*',
                    'Access-Control-Allow-Methods': 'OPTIONS, POST, GET, PUT'
                },
                body: JSON.stringify('Input Parameter is invalid'),
            };
            return response;
        }
    } catch(err){
        const response = {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': '*',
                'Access-Control-Allow-Methods': 'OPTIONS, POST, GET, PUT'
            },
            body: JSON.stringify('Error occured while connect to database.'),
        };
        return response;
    }


};
