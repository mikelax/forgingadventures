# Overview

This folder contains the Cloudformation scripts to create an environment. Most of the defaults for CFN template parameters are suited to a `test` environment and should be reviewed for a `production` set up.

## Details

The template files should be updated to an S3 bucket loation before launching a new stack. The tempates for `test.yml` and `production.yml` are the main top-level templates. These will be the parent stacks that create all the resources necessary to run the given environment, such as RDS, security, VPC, etc.

For each environment, an **app** stack will be created for the web client and api server. This has to be a top-level stack and not nested as it will be updated to deploy a new version (docker container image) of the application.

## Global Resources

The `global.yml` template creates AWS Objects that are common across environments. Examples of this could be common S3 buckets, ECS Repositories, etc. There should ever only be *ONE* copy of this template created.

### Elastic Container Service

The **Repositories** for the various docker containers are created in the `global.yml` stack.
Each environment creates a respective ECS Cluster.

## Task Definitions & Services

The Task definition and Services will be created as part of the **apps** stacks.
