#!/bin/bash

cd "$(dirname "$0")" || exit 1

npx aws-cdk bootstrap \
  --trust arn:aws:iam::147997151289:role/InfrastructureRoute53ProdRole \
  --cloudformation-execution-policies arn:aws:iam::aws:policy/AdministratorAccess
