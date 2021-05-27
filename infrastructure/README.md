# Infrastructure

## Known issues

### Lambda code not updated

#### Description

When updating the [Lambda repository](https://git.platinpower.com/emoneyflow/payoutmanager/lambda), this does _not_ automatically update the lambda functions on AWS. It's necessary to run the `$ENVIRONMENT/lambda` (e.g. staging/lambda) pipeline. This pipeline can be triggered by a dummy commit. It has been reported, that sometimes (or always) even after running this pipeline, the lambda code has still not updated. In that case, this can be resolved by going to the AWS console and deleting the lambdas, then redeploy them via Terraform. This is a tedious process and I'm working on a solution. 

#### Summary

1. Delete lambda functions in AWS console
2. Redeploy lambda (e.g. commit a change in README.md to trigger the pipeline)
3. Redeploy `api` and/or `cognito` and/or `cloudwatch` (if you've changed all functions, you need to redeploy all repos, so they get updated with the correct ARN)
4. (In doubt, redeploy API once again, to update the environment variables).

#### Background information

The source code of each Lambda is stored in a `.zip` file in a bucket on AWS. Terraform is unable to determine whether the object in the S3 bucket has changed or it is linked to a specific version of the object in the bucket, thus Terraform will not take any action, even if a new `.zip` with the has been uploaded to S3. A possible workaround is to always set the lambda to the "latest" version of the bucket object, but I have not yet determined if possible. The current workaround is to delete the lambdas to force recreation. (We could also force recreation through Terraform, but I would rather try to implement a stable implementation without forced updates).

The specific order of redeployment, i.e. `lambda` needs to be redeployed before `cognito`, `api` and `cloudwatch` is because the lambda ARNs might change in the process and need `cognito`, `api` and `cloudwatch` are connected to the `lambda` workspace via "Terraform remote state data objects".

## AWS setup

This repository manages the infrastructure for the emoneyflow payout manager project. Each folder in this repository, e.g. `production` and `staging` refer to an equally named sub-account in an AWS organization. All users for the whole organization including sub-accounts should be managed only in the root account of the organization and access to the sub-accounts is granted only via roles. Those users and roles are managed outside of Terraform. The Terraform user should have unrestricted access to the `staging` environment, but for the `production` environment it makes sense to restrict the access, so that resources containing data such as `databases`, `cognito` etc. can't be accidentally deleted via Terraform. Please refer to this blog post for more in-depth information about the role-based access: https://chariotsolutions.com/blog/post/managing-aws-users-and-roles-in-a-multi-account-organization/

## Terraform setup

Inside of the `production` and `staging` folder, there are subfolders for each component of the system, e.g. `s3`, `lambda` and so forth. The CI configuration for each folder is dynamically generated through the `.gitlab-ci.component.yml.tmpl` and `.gitlab-ci.terraform.yml`, i.e. for each subfolder the `.gitlab-ci.terraform.yml` is invoked automatically, whenever there is a change in that subfolder. It's up to the developer to ensure that everything is deployed in the correct order. For each component, a different statefile is maintained and information between two different folders can only be exchanged through `terraform_remote_state` objects, e.g.:

```
data "terraform_remote_state" "s3" {
  backend = "http"

  config = {
    address = "${var.remote_state_base_path}/${var.environment}-s3"
    username = var.remote_state_username
    password = var.remote_state_access_token
  }
}
```

can be used to retrieve data from the `s3` state file. Note the suffix used for the `address` should match the folder name inside GitLab. The variables `var.remote_state_base_path`, `var.remote_state_username` and `var.remote_state_access_token` are automatically provided by GitLab CI. This roughly mimics how accessing remote state would work on Terraform Cloud. Please refer to the GitLab documentation for more information: https://docs.gitlab.com/ee/user/infrastructure/terraform_state.html#using-a-gitlab-managed-terraform-state-backend-as-a-remote-data-source

## Dependencies

Some of the components can't be deployed before other components exist, e.g. the `s3` buckets must exist before the `lambda` repository can deploy the lambda functions somewhere and the `lambda` repository must upload the `.zip` files for each `lambda`, before the Terraform can create the Lambda functions. Unfortunately, there is no way to automatically determine what Lambda functions have to be created (because some of the functions inside the `lambda` repo could also be layers), so this has to be manually synced with the `lambda` repo. The `InvokeArn` for each lambda has to be exported through the `outputs.tf` file, so it can later be consumed by the `api` pipeline. In the Swaggerfile, there will be placeholders for the `ARNs` in the form of:

```
x-amazon-apigateway-integration:
  credentials: ${executionCredentials}
  responses:
    default:
      statusCode: "200"
  uri: ${adminGetApiInvokeArn}
...
```

Where `${executionCredentials}` is a placeholder for the role ARN which grants API gateway the rights to execute Lambda functions (We use roles to grant API gateway access to each function, so we don't have to attach resource policies to each lambda. https://medium.com/@jun711.g/aws-api-gateway-invoke-lambda-function-permission-6c6834f14b61) and `${adminGetApiInvokeArn}` is a placeholder for the InvokeArn of an equally named function in the `lambda` repository. The assignment will happen through templatefile, e.g.: 

```
templatefile("./swagger.yaml", {
    executionCredentials = aws_iam_role.pm_api.arn,
    adminGetApiInvokeArn = data.terraform_remote_state.lambda.outputs.admin_create_api_invoke_arn,
    ...
```

In general, the following order should currently be maintained when deploying from scratch:

1. network
2. route53
3. s3
4. secrets
5. aurora
6. elasticsearcch
7. lambda (ensure that the `lambda` repository has pushed the `.zip` files first)
8. cognito
9. api
10. cloudwatch
