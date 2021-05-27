"use strict"

const Sequelize = require('sequelize');
const AWS = require('aws-sdk');
const EmoneyModel = require('./models')

const DB_URL = process.env.DB_URL
const DB_USERNAME = process.env.DB_USERNAME
const DB_DATABASE = process.env.DB_DATABASE
const DB_PORT = Number(process.env.DB_PORT)
const AWS_REGION = process.env.AWS_REGION

const signer = new AWS.RDS.Signer({
  region: AWS_REGION,
  hostname: DB_URL,
  port: DB_PORT,
  username: DB_USERNAME
});

const token = signer.getAuthToken({
  username: DB_USERNAME
});

const connectionConfig = {
  host: DB_URL, // Store your endpoint as an env var
  user: DB_USERNAME,
  database: DB_DATABASE, // Store your DB schema name as an env var
  ssl: { rejectUnauthorized: false },
  password: token,
  port: DB_PORT,

  authSwitchHandler: function ({ pluginName, pluginData }, cb) {
    if (pluginName === 'mysql_clear_password') {
      const password = token + '\0';
      cb(null, password);
    }
  }
};

const sequelize = new Sequelize({
  dialect: 'mysql',
  dialectOptions: connectionConfig,
  logging: console.log('Query Logged')
});

const Models = EmoneyModel(sequelize, Sequelize);

module.exports = async () => {
  return Models;
};
