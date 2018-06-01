# Overview

This folder contains the Cloudformation scripts to create an environment. Most of the defaults for CFN template parameters are suited to a `test` environment and should be reviewed for a `production` set up.

## Details

The template files should be updated to an S3 bucket loation before launching a new stack. The tempates for `test.yml` and `production.yml` are the main top-level templates. These will be the parent stacks that create all the resources necessary to run the given environment, such as RDS, security, VPC, etc.

For each environment, an **app** stack will be created for the web client and api server. This has to be a top-level stack and not nested as it will be updated to deploy a new version (docker container image) of the application.

Currently there are two **app** stacks that will each get deployed separately from the Environment CFN stacks.

1. *client.yml* - This is the react client web application
2. *api.yml* - This is the express/graphql server api application

## Docker Commands

Here are the commands to run for each of the *two* docker containers that need to be built and pushed to ECS.

**NOTE** - In the examples below we are using a tag value of: *ea7c2g2*

Before running these commands you must first login to ECS with the following command:

```bash
# Get new login to ECS
# NOTE --profile is specifying the AWS profile defined in ~/.aws/credentials
aws ecr get-login --profile forgingadventures --no-include-email --region us-east-1
```

### API

```bash
docker build -t forgingadventures-api:ea7c2g2 .
docker tag forgingadventures-api:ea7c2g2 466853810010.dkr.ecr.us-east-1.amazonaws.com/forgingadventures-api:ea7c2g2
docker push 466853810010.dkr.ecr.us-east-1.amazonaws.com/forgingadventures-api:ea7c2g2
```

### Client

The build args used in the example commands below are for the *test* environment. Notice that also applies for the docker label as well.

```bash
docker build -t forgingadventures-client:test-ea7c2g2 \
  --build-arg REACT_APP_AUTH0_DOMAIN=forgingadventures-staging.auth0.com \
  --build-arg REACT_APP_AUTH0_CLIENT_ID=i7Srpetd9dL9Dx1ckMIhBLFnSxksaVcz \
  --build-arg REACT_APP_AUTH0_AUDIENCE=https://api-test.forgingadventures.com \
  --build-arg REACT_APP_AUTH0_REDIRECT_URI=https://playquest.forgingadventures.com/login/callback \
  --build-arg REACT_APP_WEBSOCKET_URI=wss://playquest.forgingadventures.com/api/subscriptions \
  --build-arg REACT_APP_CLOUDINARY_CLOUDNAME=forgingadventures \
  .
docker tag forgingadventures-client:test-ea7c2g2 466853810010.dkr.ecr.us-east-1.amazonaws.com/forgingadventures-client:test-ea7c2g2
docker push 466853810010.dkr.ecr.us-east-1.amazonaws.com/forgingadventures-client:test-ea7c2g2
```

## Global Resources

The `global.yml` template creates AWS Objects that are common across environments. Examples of this could be common S3 buckets, ECS Repositories, etc. There should ever only be *ONE* copy of this template created.

### Elastic Container Service

The **Repositories** for the various docker containers are created in the `global.yml` stack.
Each environment creates a respective ECS Cluster.

## Task Definitions & Services

The Task definition and Services will be created as part of the **apps** stacks.

## Basic CLI Commands

### Upload templates to S3

This command will upload the `yaml` template files to S3. It should be run from inside the `infrastructure` folder, otherwise adjust the "." local folder accordingly. Also the `--profile` value should be adjusted accordingly.

```bash
aws --profile forgingadventures s3 sync . s3://forgingadventures-resources/cfn-templates/ --delete
```

### Create Environment Stack

```bash
aws --profile forgingadventures cloudformation create-stack --stack-name forgingadventures-test \
  --region us-east-1 --on-failure DO_NOTHING --capabilities CAPABILITY_IAM \
  --template-url https://s3.amazonaws.com/forgingadventures-resources/cfn-templates/test.yml \
  --cli-input-json file://infrastructure/forgingadventures-test-parameters.json
```

### Create or Update the Application Stacks

These two commands will either create the CFN stack, or update an existing stack. These commands assume the latest copies of the template files have already been uploaded to S3 using the above command. The stack name should also be adjusted to be either `test` or `production` based on the environment you are deploying to.

#### Create API application CFN Stack

**NOTE**: For the parameter *VpcSubnetList*, you should use the *public* subnets, specify a comma separated list of subnet1,subnet2.

```bash
aws --profile forgingadventures cloudformation create-stack --stack-name forgingadventures-test-api \
  --region us-east-1 --on-failure DO_NOTHING --capabilities CAPABILITY_IAM \
  --template-url https://s3.amazonaws.com/forgingadventures-resources/cfn-templates/api.yml \
  --cli-input-json file://infrastructure/test-api-parameters.json
```

#### Update API application CFN Stack

```bash
aws --profile forgingadventures cloudformation update-stack --stack-name forgingadventures-test-api \
  --region us-east-1 --capabilities CAPABILITY_IAM \
  --template-url https://s3.amazonaws.com/forgingadventures-resources/cfn-templates/api.yml \
  --cli-input-json file://infrastructure/test-api-parameters.json
```

#### Create Client application CFN Stack

**NOTE**: For the parameter *VpcSubnetList*, you should use the *public* subnets, specify a comma separated list of subnet1,subnet2.

```bash
aws --profile forgingadventures cloudformation create-stack --stack-name forgingadventures-test-client \
  --region us-east-1 --on-failure DO_NOTHING --capabilities CAPABILITY_IAM \
  --template-url https://s3.amazonaws.com/forgingadventures-resources/cfn-templates/client.yml \
  --cli-input-json file://infrastructure/test-client-parameters.json
```

#### Update Client application CFN Stack

```bash
aws --profile forgingadventures cloudformation update-stack --stack-name forgingadventures-test-client \
  --region us-east-1 --capabilities CAPABILITY_IAM \
  --template-url https://s3.amazonaws.com/forgingadventures-resources/cfn-templates/client.yml \
  --cli-input-json file://infrastructure/test-client-parameters.json
```
