# EmoneyFlow Project
### Explaination

This project enable customer, as an internationally operation payment service provider to work with merchants under the brand to enable them to execute their payments to subcontractors, affilates, advertising partners and content partners.

#### App Flow

<img align="left" src="App Flow.png" width=1500 >

As you can check the above image, this projects was consists with React JS frontend + AWS Serverless.
In AWS serverless backend, it is using AWS Cognito for authentication, Elastic Service and Aurora Database.
Also the other rest apis was implemented in lambda functions. In some lambda functions, they use to call external apis to complete apis.
As showed in above diagram, authentication modules were implemented for only cognito, so authentication lambda functions were not exists. And also for security of apis, we integrated with AWS api gateway and cognito. So such as token check and generating token will be depend on only AWS Congito. So all apis will be redirected to lambda functions in condition to pass checking tokens for security.

#### API Lambda Function Naming
In this repository, lambda function folder name is related to api http method and user type ( admin, general user[Customer]) as well as api url. 
For example
```sh
adminCreateUser -> https://{{baseUrl}}/admin/user: POST Request
```
This is the normal lambda functin naming rule, but there are following examples of other types of rules.
```sh
adminDeleteUserId -> https://{{baseUrl}}/admin/user/id: DELETE Request
```
```sh
userGetDashboardBalance -> https://{{baseUrl}}/user/dashboardr/balance: GET Request
```
Code was contained in `$foldername/src/index.js`.

And then if you are trying to add more functions, we should follow these name rules.

## Configuration 
The functions must be configured through the following environment variables:

//DataBase\
process.env.DB_URL\
process.env.DB_USERNAME\
process.env.DB_DATABASE\
process.env.DB_PORT

//Cognito\
process.env.COGNITO_USER_POOL_ID\
process.env.COGNITO_CLIENT_ID\
process.env.COGNITO_REST_API_ID\
process.env.COGNITO_STAGE_NAME\
process.env.COGNITO_PLAN_ID

//ElasticSearch\
process.env.ES_DOMAIN\
process.env.ES_INDEX_TYPE\
process.env.ES_INDEX

#### Special Functions
##### - userSchedulePayout function
This function is to run payout at scheduled time by searching schedule payouts on database. We can configure to run this function like cron job on aws by creating [AWS RULE][aws1]

##### - userReconciliation function
This is the reconciliation function to get reconciliations from sepa express by using external sepa apis.
This also should be configured by creating [AWS RULE][aws1].

##### - Cognito Trigger functions
  - cognitoCustomMessage
  This is the cognito lambda CUSTOM_MESSAGE trigger lambda function
  - cognitoPostConfirmation
  This is the cognito lambda POST_CONFIRMATION trigger lambda function

### AWS Configuration
#### AWS Rule Setup for Reconciliation function and schedule payout

We need to setup AWS Rule for cron job of Reconciliation and SchdulePayout lambda function. We can configure on [AWS RULE][aws1]. 
For Reconciliation function, we should to run the at 6:00, 10:00, 14:00 and 18:00 UTC+1(Berlin Time) per day.
But AWS provides only UTC time, so we can set rule for 5:00, 9:00, 13:00 and 17:00.
So we can configure 4 rules with cognito cron expressions for Reconciliation lambda function.

- 5:00 UTC --> 0 5 * * ? *
- 9:00 UTC --> 0 9 * * ? *
- 13:00 UTC --> 0 5 * * ? *
- 17:00 UTC --> 0 17 * * ? *

For schduled payout function, we can configure rule as same as reconciliation function.
We need to run schedule payout function at 6:00 UTC+1(Berlin Time).
So we can make cron expression like below.

- 5:00 UTC --> 0 5 * * ? *

Please check [AWS RULE Documentation][aws_rule_help] for futher more informaion

#### Cognito Setup for custom attributes
We are using AWS Cognito for authentication in our project. So we should configure AWS Cognito custom attributes to use our custom authentication and validation.
When creating the custom attribute on cognito user pool, we should append prefix custom:, so that cognito can accept custom attribute.

##### Custom User Type Attribute
We can check whether the user is Admin or general User for our project by checking this atribute.
Here is the json configuration for user type custom attribute.
{Type:number, Name: custom:userType, MinValue: 0, MaxValue: 10, Mutable: true}

##### Custom Api Key Attribute
This attribute is used for API Gateway Authorization, so that api key will be created when confirm signup on the cognito user pool.
JSON Type: 
{Type:string, Name: custom:apiKey, MinLength: 0, MaxLength: 10, Mutable: true}

To create this api key and use attribute for api gateway authorization, we need to create Usage Plan of API Gateway for our backend project. In next section, how to configure and set API Gateway Usage Plan.

#### Configure API Gateway Usage Plan
We can create API Gateway Usage Plan on [AWS API USAGE][aws_usage]
After create API Gateway Usage Plan, we can use this plan id for creating api keys, on trigger function of this API Gateway.

### Create AWS Secret Manager to combine with lambda function environment variables
We should create AWS Secret Manager to set several environment variablese as well as RDS credentials.
So that we can create staging and production secret manager sepeartely, and then add above variables which we are using in our lambda functions on the [AWS Secret Manger][aws_secret].

//DataBase
DB_URL\
DB_USERNAME\
DB_DATABASE\
DB_PORT\

//Cognitor
COGNITO_USER_POOL_ID\
COGNITO_CLIENT_ID\
COGNITO_REST_API_ID\
COGNITO_STAGE_NAME\
COGNITO_PLAN_ID\

//ElasticSearch
ES_DOMAIN\
ES_INDEX_TYPE\
ES_INDEX\

There are some kind of solutions to combine aws secret manager and lambda function environment variables like followings. 

- [AWS Cloud Formation][aws_secret_cloud]
- [Using Terraform Code][aws_secret_terraform]
- [Inserting Codes to get secrets value][aws_get_secret_manager]

But I think the most effective solution is second solution to use terraform code for our backend project.

And then we need to combine these variables values to lambda Env variables, so we need to use terraform codes to store app secrets variables on environment variables from [AWS Secret Manger][aws_secret].  

Also with third solution, is not good one for our project. Because when we retrieve the variables from secret of [AWS Secret Manager][aws_secret], we should use region and secret name information, so again hardcode will be impleneted in the lambda functions.
So this is also not good solution.

"environment": [
      {
        "name": "AWS_SECRET_ID",
        "value": "${aws_secretsmanager_secret.app_secrets.name}"
      }
    ]

Like above terraform code, we can combine secret manager value and lambda function environment variables.

## License

EMoneyFlow
**EmoneyFlow Team!**

[//]: # 
   [aws1]: <https://console.aws.amazon.com/cloudwatch/home?region=us-east-1#rules:action=create>
   [aws_rule_help]: <https://docs.aws.amazon.com/AmazonCloudWatch/latest/events/ScheduledEvents.html#RateExpressions>
   [aws_usage]: <https://console.aws.amazon.com/apigateway/home?region=us-east-1#/usage-plans/>
   [aws_usage]: <https://console.aws.amazon.com/apigateway/home?region=us-east-1#/usage-plans/>
   [aws_secret]: <https://console.aws.amazon.com/secretsmanager/home?region=us-east-1#!/listSecrets>
   [aws_secret_cloud]: <https://aws.amazon.com/blogs/security/how-to-securely-provide-database-credentials-to-lambda-functions-by-using-aws-secrets-manager/>
   [aws_secret_terraform]: <https://www.obytes.com/blog/store-app-secrets-on-env-vars-using-aws-secrets-manager-and-terraform>
   [aws_system_manager]: <https://console.aws.amazon.com/systems-manager/parameters?region=us-east-1>
   [aws_get_secret_manager]: <https://medium.com/swlh/using-aws-secrets-manager-to-securely-store-and-retrieve-app-secrets-in-node-js-ada424feb077>
   
   
