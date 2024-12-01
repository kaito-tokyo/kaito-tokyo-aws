#!/bin/bash

cd "$(dirname "$0")" || exit 1

npm run cdk -- bootstrap aws://913524900670/us-east-1 \
  --trust=arn:aws:iam::147997151289:role/Builders/InfrastructureBuilderCodeBuildRole \
  --cloudformation-execution-policies=arn:aws:iam::aws:policy/AdministratorAccess
