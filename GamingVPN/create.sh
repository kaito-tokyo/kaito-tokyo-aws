#!/bin/bash

cd "$(dirname "$0")" || exit 1

npm run cdk -- bootstrap aws://872515250936/us-east-1 \
  --trust=arn:aws:iam::147997151289:role/Builders/GamingVPNBuilderCodeBuildRole \
  --cloudformation-execution-policies=arn:aws:iam::aws:policy/AdministratorAccess
