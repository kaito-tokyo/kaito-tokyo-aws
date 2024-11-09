#!/bin/bash

cd "$(dirname "$0")" || exit 1

aws cloudformation create-stack-set \
  --stack-set-name=GitHubActionsSelfHostedObsChatTalkerAssumeRolesDev001 \
  --template-body="$(<ObsChatTalkerAssumeRolesDev001.yaml)" \
  --capabilities=CAPABILITY_NAMED_IAM \
  --permission-model=SERVICE_MANAGED \
  --call-as=DELEGATED_ADMIN

# aws cloudformation create-stack-instances \
#   --stack-set-name=GitHubActionsSelfHostedObsChatTalkerAssumeRolesDev001 \
#   --deployment-targets=Accounts=586794439382,OrganizationalUnitIds=ou-03d8-tru29wjm,AccountFilterType=INTERSECTION \
#   --call-as=DELEGATED_ADMIN \
#   --regions=us-east-1
