# Overview

This folder contains the Cloudformation scripts to create an environment. Most of the defaults for CFN template parameters are suited to a `test` environment and should be reviewed for a `production` set up. 

# Details

The template files should be updated to an S3 bucket loation before launching a new stack. The tempates for `test.yml` and `production.yml` are the main top-level templates. All others are created as nested stacks. 

## Elastic Container Service

The **Repositories** for the various docker containers should be created manually. 
Each environment creates a respective ECS Cluster. 

### Task Definitions

TODO
