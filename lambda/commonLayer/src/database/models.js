
module.exports = (sequelize, type) => {
  var Company = sequelize.define('company', {
    id: { type: type.BIGINT, primaryKey: true, autoIncrement: true },
    name: { type: type.STRING },
    firstName: { type: type.STRING },
    lastName: { type: type.STRING },
    email: {
      type: type.STRING,
      allowNull: { args: false, msg: "Please enter your email address" },
      validate: {
        isEmail: { args: true, msg: "Please enter a valid email address" }
      },
      unique: { args: true, msg: "Email already exists" }
    },
    bank: { type: type.STRING },
    iban: { type: type.STRING },
    bic: { type: type.STRING },
    accountNo: { type: type.STRING },
    routingNo: { type: type.STRING },
  });

  var API = sequelize.define('api', {
    id: { type: type.BIGINT, primaryKey: true, autoIncrement: true },
    apiType: { type: type.INTEGER },
    apiUsername: { type: type.STRING },
    apiPassword: { type: type.STRING },
    apitenant: { type: type.STRING },
    merchantId: { type: type.STRING },
    connectorId: { type: type.STRING },
    feeType: { type: type.STRING },
    amount: { type: type.INTEGER },
    token: { type: type.STRING(2046) },
    expiration: { type: type.BIGINT },
    startDate: { type: type.DATE },
    status: { type: type.INTEGER, defaultValue: 0 },
    balance: { type: type.BIGINT, defaultValue: 0 },
    info: { type: type.TEXT }
  });

  var User = sequelize.define('user', {
    id: { type: type.BIGINT, primaryKey: true, autoIncrement: true },
    cognitoId: { type: type.STRING },
    userType: { type: type.INTEGER, defaultValue: 0 },
    email: {
      type: type.STRING,
      allowNull: { args: false, msg: "Please enter your email address" },
      validate: {
        isEmail: { args: true, msg: "Please enter a valid email address" }
      },
      unique: { args: true, msg: "Email already exists" }
    },
    firstName: { type: type.STRING },
    lastName: { type: type.STRING },
    mfaStatus: { type: type.INTEGER, defaultValue: 0 },
    timezone: { type: type.STRING },
    timeformat: { type: type.STRING, defaultValue: '24' },
    dateformat: { type: type.STRING, defaultValue: 'mdy' },
    xyformat: { type: type.STRING, defaultValue: '1' },
    status: { type: type.INTEGER }
  });

  var Payee = sequelize.define('payee', {
    id: { type: type.BIGINT, primaryKey: true, autoIncrement: true },
    firstName: { type: type.STRING },
    lastName: { type: type.STRING },
    affiliateId: { type: type.STRING },
    method: { type: type.INTEGER },
    email: {
      type: type.STRING,
      allowNull: { args: false, msg: "Please enter your email address" },
      validate: {
        isEmail: { args: true, msg: "Please enter a valid email address" }
      },
      unique: { args: true, msg: "Email already exists" }
    },
    bankName: { type: type.STRING, allowNull: false },
    iban: { type: type.STRING, allowNull: false },
    bic: { type: type.STRING, allowNull: false },
    currency: { type: type.STRING, allowNull: false },
    addressLine1: { type: type.STRING, allowNull: false },
    languageCode: { type: type.STRING, allowNull: false },
    countryCode: { type: type.STRING, allowNull: false },
    memo: { type: type.STRING },
    info: { type: type.TEXT }   
  });
  var Balance = sequelize.define('balance', {
    id: { type: type.BIGINT, primaryKey: true, autoIncrement: true },
    amount: { type: type.BIGINT, allowNull: false },
    currency: { type: type.STRING, allowNull: false },
    iban: { type: type.STRING, allowNull: false },
  })

  var Payout = sequelize.define('payout', {
    id: { type: type.BIGINT, primaryKey: true, autoIncrement: true },
    reference: { type: type.STRING, allowNull: false },
    amount: { type: type.BIGINT, allowNull: false },
    status: { type: type.INTEGER, defaultValue: 0 /** Not Requested */ },
    method: { type: type.INTEGER },
    currency: { type: type.STRING, allowNull: false },
    //response
    payoutId: { type: type.STRING },
    customerId: { type: type.STRING },
    customerState: { type: type.STRING },
    bankAccountId: { type: type.STRING },
    bankAccountState: { type: type.STRING },
    mandateId: { type: type.STRING },
    message: { type: type.STRING },
    refundCount: { type: type.INTEGER },
    refundAmount: { type: type.INTEGER },
    state: { type: type.STRING, defaultValue: "scheduled" },
    payoutCreatedAt: { type: type.DATE(6) },
    payoutUpdatedAt: { type: type.DATE(6) },
    rReference: { type: type.STRING },
    softDescriptor: { type: type.STRING },
    submitAfer: { type: type.DATE(6) },
    dateValue: { type: type.DATE(6) },
    dateType: { type: type.STRING },
    direction: { type: type.INTEGER, defaultValue: 0 /* OUT PAYOUT 1 : IN PAYOUT*/ },
    tryCount: { type: type.INTEGER, defaultValue: 0 }
  });

  var TmpPassword = sequelize.define('TmpPassword', {
    id: { type: type.BIGINT, primaryKey: true, autoIncrement: true },
    password: { type: type.STRING, allowNull: false },
    email: { type: type.STRING, allowNull: false },
  })

  Payee.belongsTo(Company);
  Company.hasMany(Payee, { onDelete: 'CASCADE' });
  API.belongsTo(Company);
  Company.hasMany(API, { onDelete: 'CASCADE' });
  User.belongsTo(Company);
  Company.hasMany(User, { onDelete: 'CASCADE' });

  Payout.belongsTo(User, { onDelete: 'CASCADE' });
  User.hasMany(Payout, { onDelete: 'CASCADE' });
  Payout.belongsTo(Payee);
  Payee.hasMany(Payout, { onDelete: 'CASCADE' });
  Payout.belongsTo(Company);
  Company.hasMany(Payout);
  Payout.belongsTo(API);
  API.hasMany(Payout, { onDelete: 'CASCADE' });

  Balance.belongsTo(API);
  API.hasMany(Balance, { onDelete: 'CASCADE' });
  Balance.belongsTo(Company);
  Company.hasMany(Balance, { onDelete: 'CASCADE' });

  TmpPassword.belongsTo(User);
  User.hasMany(TmpPassword);
  return { API, Company, User, Payee, Payout, Balance, TmpPassword, sequelize };
}