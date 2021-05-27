const AWS = require('aws-sdk');

const UserPoolId = process.env.COGNITO_USER_POOL_ID
const ClientId = process.env.COGNITO_CLIENT_ID
const AWS_REGION = process.env.AWS_REGION

const REST_API_ID = process.env.API_GATEWAY_REST_API_ID
const STAGE_NAME = process.env.API_GATEWAY_STAGE_NAME
const PLAN_ID = process.env.API_GATEWAY_PLAN_ID

AWS.config.update({ region: AWS_REGION });
const QR = require('qrcode')
const cognito = new AWS.CognitoIdentityServiceProvider({});

const API = new AWS.APIGateway({ region: AWS_REGION })

module.exports.generatePwd = () => {
    var specials = '!@#$%^&*()_+{}:"<>?\|[];\',./`~';
    var lowercase = 'abcdefghijklmnopqrstuvwxyz';
    var uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var numbers = '0123456789';
    var all = specials + lowercase + uppercase + numbers;
    
    const pick = function(temp, min, max) {
        var n, chars = '';

        if (typeof max === 'undefined') {
            n = min;
        } else {
            n = min + Math.floor(Math.random() * (max - min));
        }
    
        for (var i = 0; i < n; i++) {
            chars += temp.charAt(Math.floor(Math.random() * temp.length));
        }
    
        return chars;
    }
    
    const shuffle = function(str) {
        var array = str.split('');
        var tmp, current, top = array.length;
    
        if (top) while (--top) {
            current = Math.floor(Math.random() * (top + 1));
            tmp = array[current];
            array[current] = array[top];
            array[top] = tmp;
        }
    
        return array.join('');
    }
    var password = shuffle(pick(specials, 1) + pick(lowercase, 1) + pick(uppercase, 1) + pick(all, 3, 10));
    return password;
}

module.exports.createCongnitoUser = async ({ email, password }) => {
	return await new Promise((resolve, reject) => {
		const params = {
			ClientId: ClientId,
			Username: email,
			Password: password
		};
		cognito.signUp(params, function (err, data) {
			if (err) {
				reject(err)// an error occurred
			}
			else {
				resolve(data);           // successful response
			}
		});
	});
}

module.exports.createAdminCongnitoUser = async ({ password, attributes }) => {
	return await new Promise((resolve, reject) => {
		const userAttributes = attributes.map((attribute, index) => {
			return { Name: attribute.name, Value: attribute.value }
		});
		const params = {
			UserPoolId: UserPoolId,
			Username: email,
			DesiredDeliveryMediums: [
			    "EMAIL"
		    ],
			TemporaryPassword: password,
			UserAttributes: userAttributes,
		};
		console.log('params = ', params)
		cognito.adminCreateUser(params, function (err, data) {
			if (err) {
				reject(err)// an error occurred
			}
			else {
				resolve(data);           // successful response
			}
		});
	});
}


module.exports.getCognitoUsers = async ({ }) => {
	return await new Promise((resolve, reject) => {
		const params = {
			UserPoolId: UserPoolId
		}
		cognito.listUsers(params, (err, data) => {
			if (err) {
				reject(err);
			} else {
				resolve(data);
			}
		});
	});
}

module.exports.updateAttributeCognitoUser = async ({ sub, attributes }) => {
	return await new Promise((resolve, reject) => {
		const userAttributes = attributes.map((attribute, index) => {
			return { Name: attribute.name, Value: attribute.value }
		});
		const params = {
			UserAttributes: userAttributes,
			Username: sub,
			UserPoolId: UserPoolId
		}
		cognito.adminUpdateUserAttributes(params, (err, results) => {
			if (err) reject(err)
			else resolve(results)
		});
	});
}

module.exports.adminConfirmSignUp = async (sub, metas) => {
	return await new Promise((resolve, reject) => {
		let metaAttributes = {}
		if (metas) {
			metas.map((meta, index) => {
				metaAttributes[meta.name] = meta.value;
			});
		}
		const params = {
			UserPoolId: UserPoolId,
			Username: sub,
			ClientMetadata: metaAttributes
		}
		cognito.adminConfirmSignUp(params, (err, results) => {
			if (err) reject(err)
			else resolve(results);

		});
	});
}

module.exports.adminDisableUser = async (sub) => {
	return await new Promise((resolve, reject) => {
		const params = {
			Username: sub,
			UserPoolId: UserPoolId
		};
		cognito.adminDisableUser(params, (err, result) => {
			if (err) reject(err)
			else resolve(result)
		})
	})
}

module.exports.adminEnableUser = async (sub) => {
	return await new Promise((resolve, reject) => {
		const params = {
			Username: sub,
			UserPoolId: UserPoolId
		};
		cognito.adminEnableUser(params, (err, result) => {
			if (err) reject(err)
			else resolve(result)
		})
	})
}

module.exports.adminDeleteUser = async (sub) => {
	return await new Promise((resolve, reject) => {
		const params = {
			Username: sub,
			UserPoolId: UserPoolId
		};
		cognito.adminDeleteUser(params, (err, result) => {
			if (err) reject(err)
			else resolve(result)
		})
	})
}

module.exports.adminGetUser = async (sub) => {
	return await new Promise((resolve, reject) => {
		const params = {
			Username: sub,
			UserPoolId: UserPoolId
		};
		cognito.adminGetUser(params, (err, result) => {
			if (err) reject(err)
			else resolve(result)
		})
	})
}

module.exports.getCognitoUser = async (accessToken) => {
	return new Promise((resolve, reject) => {
		const params = {
			"AccessToken": accessToken,
		}
		cognito.getUser(params, function (error, data) {
			if (error) {
				console.log('error = ', error);
				reject(error);
			} else {
				resolve(data);
			}
		});
	});
}

module.exports.adminSetUserPassword = async (username, password) => {
	return new Promise((resolve, reject) => {
		const params = {
			"Password": password,
			"Permanent": true,
			"Username": username,
			"UserPoolId": UserPoolId
		};
		cognito.adminSetUserPassword(params, function (error, data) {
			if (error) {
				reject(error)
			} else {
				resolve(data);
			}
		});
	})
}

module.exports.validateMFA = async (UserCode, AccessToken) =>
	await new Promise((resolve, reject) => {
		const params = {
			AccessToken,
			UserCode,
		}

		cognito.verifySoftwareToken(params, (err, result) => {
			if (err) reject(err)
			else resolve(result)
		})
	})

module.exports.disableMFA = async (sub) =>
	await new Promise((resolve, reject) => {
		const params = {
			UserPoolId: UserPoolId,
			Username: sub,
			SoftwareTokenMfaSettings: {
				Enabled: false,
			},
		}

		cognito.adminSetUserMFAPreference(params, (err, result) => {
			if (err) reject(err)
			else resolve(result)
		})
	})

module.exports.enableMFA = async (sub) =>
	await new Promise((resolve, reject) => {
		const params = {
			"AccessToken": AccessToken,
			"SoftwareTokenMfaSettings": {
				"Enabled": true,
				"PreferredMfa": true
			}
		}
		cognito.setUserMFAPreference(params, (err, result) => {
			if (err) reject(err)
			else resolve(result);
		})
	})

module.exports.getQRCode = async (AccessToken) =>
	await new Promise((resolve, reject) => {
		cognito.associateSoftwareToken(
			{
				AccessToken,
			},
			(err, result) => {
				if (err) {
					reject(err)
				} else {
					const name = 'Emoney Flow'
					const uri = `otpauth://totp/${decodeURI(name)}?secret=${result.SecretCode
						}`
					console.log(uri)

					QR.toDataURL(uri, (err, result1) => {
						if (err) reject(err)
						else resolve({ image: result1, code: result.SecretCode })
					})
				}
			}
		)
	})

module.exports.changePassword = async (accessToken, currentPassword, newPassword) =>
	await new Promise((resolve, reject) => {
		const params = {
			AccessToken: accessToken,
			PreviousPassword: currentPassword,
			ProposedPassword: newPassword
		}

		cognito.changePassword(params, (err, result) => {
			if (err) reject(err)
			else resolve(result)
		})
	})
module.exports.adminUserResetPassword = async (userId) => {
	return new Promise((resolve, reject) => {
		const params = {
			Username: userId,
			UserPoolId: UserPoolId,
		};
		cognito.adminResetUserPassword(params, function (error, data) {
			if (error) reject(error)
			else resolve(data);

		})
	});
}
module.exports.generateApiKey = async (sub) => {
	return await new Promise((resolve, reject) => {
		const params = {
			name: `Emoney-${sub}`,
			generateDistinctId: true,
			enabled: true,
			stageKeys: [
				{
					restApiId: REST_API_ID,
					stageName: STAGE_NAME,
				},
			],
		}

		API.createApiKey(params, (err, results) => {
			if (err) reject(err)
			else resolve(results)
		})
	})
}

module.exports.createUsagePlanKey = async (keyId) => {
	return await new Promise((resolve, reject) => {
		const params = {
			keyId,
			keyType: 'API_KEY',
			usagePlanId: PLAN_ID,
		}

		API.createUsagePlanKey(params, (err, results) => {
			if (err) reject(err)
			else resolve(results)
		})
	})
}

module.exports.saveApiKey = async (sub, apikey) => {
	return await new Promise((resolve, reject) => {
		const params = {
			UserAttributes: [
				{
					Name: 'custom:apiKey',
					Value: apikey,
				},
			],
			Username: sub,
			UserPoolId: UserPoolId,
		}

		cognito.adminUpdateUserAttributes(params, (err, results) => {
			if (err) reject(err)
			else resolve(results)
		})
	})
}

module.exports.changePassword = async (accessToken, currentPassword, newPassword) =>
	await new Promise((resolve, reject) => {
		const params = {
			AccessToken: accessToken,
			PreviousPassword: currentPassword,
			ProposedPassword: newPassword
		}

		cognito.changePassword(params, (err, result) => {
			if (err) reject(err)
			else resolve(result)
		})
	});