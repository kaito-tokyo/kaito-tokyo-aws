#!/bin/bash

cd "$(dirname "$0")" || exit 1

if [[ $(aws sts get-caller-identity --output=text | cut -f1) != 147997151289 ]]
then
	echo "Invalid account!"
	exit 1
fi

npm run cdk -- bootstrap \
	--cloudformation-execution-policies=arn:aws:iam::aws:policy/AdministratorAccess
