#!/bin/bash

cd "$(dirname "$0")" || exit 1

if [[ $(aws sts get-caller-identity --output=text | cut -f1) != 784179762749 ]]
then
	echo "Invalid account!"
	exit 1
fi

npx aws-cdk bootstrap \
	--cloudformation-execution-policies=arn:aws:iam::aws:policy/AdministratorAccess
