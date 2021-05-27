const connectToDatabase = require('/opt/database/db');
const { checkApiAndGetToken, createUser, updateUser, deleteUsers} = require('/opt/database');

exports.handler = async (event, context, callback) => {
    try
    {
        const { Company, API, User } = await connectToDatabase();
        const body = JSON.parse(event.body);
        let id = parseInt(body.id, 0);
        let company;
        if (id > 0 && !Number.isNaN(id)) {
            delete body.id;
            await Company.update(body, {where: {id}});
        }
        else {
            return {
    			statusCode: 400,
                headers: {
    			    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': '*',
                    'Access-Control-Allow-Methods': 'OPTIONS, POST, GET, PUT'
    			},
    			body: JSON.stringify('Input Correct Id')
		}
        }
                   
        const apis = body.apis || [];
        const users = body.users || [];
        const dbApis = await API.findAll({ where: { companyId: id}});
        let apiIds = [];
        dbApis.forEach((dbApi, index) => {
            let isExist = false;
            apis.forEach((iApi, iindex) => {
                if (iApi.id === dbApi.id.toString()){
                    isExist = true;
                }
            });
            if (!isExist){
                apiIds.push(dbApi.id);
            }
        });
        await API.destroy({ where: { id: apiIds }});
        for (var i = 0 ; i < apis.length; i++){
            try{
                
                let api = apis[i];
                let apiRow = {};
                if (!api.hasOwnProperty('isSaved') || (api.hasOwnProperty('isSaved') && !api.isSaved) ){
                    continue;
                }

                api['companyId'] = id;
                if (typeof api.id === 'string' && api.id.startsWith("added-")){
                    const dApiCount = await API.count({ where: { apiType: api.apiType, companyId: id}});
                    console.log('count = ', dApiCount);
                    if (dApiCount > 0){
                        continue;
                    }
                    delete api.id;
                    api['companyId'] = id;
                    apiRow = API.build(api);  
                    await apiRow.save();    
                } else {
                    await API.update(api, {where: {id: api.id}});
                    apiRow = await API.findOne({where: {id: api.id}});
                }
                try{
                    await checkApiAndGetToken(apiRow);    
                } catch (err)  {
                    console.log('check api token error')
                }
                
            }
            catch (err)
            {
                console.log('error ', err);
            }
            
        };
        let userIds = [];
        const dbUsers = await User.findAll({ where: { companyId: id}});
        dbUsers.forEach((dbUser, index) => {
            let isExist = false;
            users.forEach((iUser, iindex) => {
                if (iUser.id === dbUser.id.toString()){
                    isExist = true;
                }
            });
            if (!isExist){
                userIds.push(dbUser.id);
            }
        });
        await deleteUsers(userIds);
        for (let i = 0 ; i < users.length; i++){
            try{
                let user = users[i];

                if (!user.hasOwnProperty('isSaved') || (user.hasOwnProperty('isSaved') && !user.isSaved) ){
                    continue;
                }
                user['companyId'] = id;
                if (typeof user.id === 'string' && user.id.startsWith("added-")){
                    delete user.id;
                    user.companyId = id;
                    await createUser(user)
                } else {
                    await updateUser(user)
                }    
            } catch (error)
            {
                console.log('User save error ', error);
            }
            
        };
        const updatedCompany = await Company.findOne({ where: {id},
            include: [API, User]
        });
        
        return {
			statusCode: 200,
            headers: {
			    'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': '*',
                'Access-Control-Allow-Methods': 'OPTIONS, POST, GET, PUT'
			},
			body: JSON.stringify(updatedCompany)
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
