#!/bin/bash

cd "$(dirname "$0")" || exit 1

cdk deploy --require-approval never MainStack
