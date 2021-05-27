const connectToDatabase = require('./db');
const { loginWithSepa } = require('/opt/sepa');
const { getCognitoUser, generatePwd, updateAttributeCognitoUser, adminDeleteUser, createAdminCongnitoUser, adminDisableUser, generatePwd } = require('./../cognito');
const API_EXPIRATE_SECOND = 3600;

module.exports.getUserFromSub = async (sub) => {
    const { User } = await connectToDatabase();
    const user = User.findOne({
        where: { cognitoId: sub }
    });
    return user;
}

module.exports.getApi = async (type, companyId) => {
    const { API } = await connectToDatabase();
    const api = API.findOne({
        where: [{ companyId: companyId }, { apiType: type }],
    });
    return api;
}
module.exports.updateApi = async (api) => {    
    await api.save();
    return api;
}

module.exports.getUserInfo = async (accessToken) => {
    const cUser = await getCognitoUser(accessToken);
    
    const { User } = await connectToDatabase();
    const user = User.findOne({
        where: { cognitoId: cUser.Username},        
    });
    return user;
}

module.exports.createUser = async (user) => {
    const password = generatePwd();
    const attributes = [];
    attributes.push({ Name: 'email', Value: user.email})
    attributes.push({ Name: 'familiy_name', Value: user?.firstName || ''})
    attributes.push({ Name: 'given_name', Value: user?.lastName || ''})    
    attributes.push({ Name: 'email_verified', Value: 'true'})
    const cUser = await createAdminCongnitoUser({password: password});
    const { User } = await connectToDatabase();
    let userRow = User.build(user);
    userRow['cognitoId'] = cUser.Username;
    await userRow.save();       
    if (user.status !== 1){
        await adminDisableUser(cUser.UserSub);
    }
    return userRow;
}

module.exports.updateUser = async (user) => {
    const { User } = await connectToDatabase();
    user.id = parseInt(user.id);
    const oUser = await User.findByPk(user.id);    
    await User.update(user, {where : { id: user.id}})
    let updatedUser = await User.findByPk(oUser.id);    
    try{
    	let attributes = [];
    	attributes.push({name: 'email', value: updatedUser.email});
    	attributes.push({name: 'name', value: updatedUser.firstName + ' ' + updatedUser.lastName})
        console.log('attributes ', attributes);
        try{
            const cUpdatedUser = await updateAttributeCognitoUser({sub: updatedUser['cognitoId'], attributes: attributes});	    
        } catch (err)
        {
            console.log('enabled = ', err)
        }    	
    	if (updatedUser['status'] === 0){
    		await adminDisableUser(oUser['cognitoId'])
    	} else if (updatedUser['status'] === 1) {
    		await adminEnableUser(oUser['cognitoId'])
    	}
    } catch (error) {
    	console.log(error);
    }

    const { User } = await connectToDatabase();
    /*
    if (user?.id && user?.id > 0)
    {
        const oUser = User.findByPk(user.id);
        let userRow = User.update(user, {where : { id: user.id}})
        return updateAttributeCognitoUser(oUser.Username, userRow);
    } else {
        this.createUser(user);
    }*/
}

module.exports.deleteUser = async (id) => {
    const { User } = await connectToDatabase();
    const user = await User.findByPk(id);    
    try{
        await adminDisableUser(user.cognitoId)
        const result = await adminDeleteUser(user.cognitoId);    
    } catch(err){
        console.log('err = ', err);
    }    
    await User.destroy({
        where: { id: id}
    });
    return user;

}

module.exports.deleteUsers = async (ids) => {
    for (var i = 0 ; i < ids.length; i++ )
    {
        await deleteUser(ids[i]);
    }
}

module.exports.checkApiAndGetToken = async (method, companyId) => {
    const { API } = await connectToDatabase();
    const api = await API.findOne({
        where: [{ companyId: companyId }, { apiType: method }],
    });

    if (api) {
        const token = api.token;
        const startDate = api.startDate ? api.startDate : "0";
        const expiration = api.expiration ? api.expiration : 0;
        const nowDate = Date.now();
        const sDate = Date.parse(startDate);

        if (token && (nowDate < sDate + expiration * 1000)) {
            return api;
        }
        else {
            api.expiration = API_EXPIRATE_SECOND;
            try {
                const response = await loginWithSepa(api);
                if (response.data.accessToken) {
                    api.startDate = new Date();
                    api.token = response.data.accessToken;
                    api.expiration = response.data.expireInSeconds;
                    api.status = 1;
                    await api.save();
                    return api;
                } else {
                    return null;
                }
            } catch (error) {
                return null;
            }


        }
    } else {
        return null;
    }
}


module.exports.updatePayout = async (Payout, Payee, id, response) => {
    return new Promise((resolve, reject) => {
        Payout.update({
            payoutId: response.payout.id,
            customerId: response.payout.customerId,
            customerState: response.payout.customer.state,
            bankAccountId: response.payout.bankAccountId,
            bankAccountState: response.payout.bankAccount.state,
            state: response.payout.state,
            payoutCreatedAt: response.payout.payoutCreatedAt,
            rReference: response.payout.reference,
            softDescriptor: response.payout.softDescriptor,
            submitAfter: response.payout.submitAfter,
            status: 201
        }, { where: { id: id } }).then(function () {
            resolve(Payout.findOne({ where: { id }, include: [Payee] }));
        }).catch(function (error) {
            reject(error);
        });
    })
}