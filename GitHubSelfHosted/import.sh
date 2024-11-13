#!/bin/bash

cd "$(dirname "$0")" || exit 1

npx aws-cdk import -m resource-mapping-ImportedCodeConnectionStack.json ImportedCodeConnectionStack
