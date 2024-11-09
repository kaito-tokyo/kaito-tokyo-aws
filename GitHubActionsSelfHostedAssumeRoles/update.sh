#!/bin/bash

cd "$(dirname "$0")" || exit 1

aws cloudformation update-stack-set \
  --stack-set-name=GitHubActionsSelfHostedObsChatTalkerAssumeRolesDev001 \
  --template-body="$(<ObsChatTalkerAssumeRolesDev001.yaml)" \
  --capabilities=CAPABILITY_NAMED_IAM \
  --permission-model=SERVICE_MANAGED \
  --call-as=DELEGATED_ADMIN
