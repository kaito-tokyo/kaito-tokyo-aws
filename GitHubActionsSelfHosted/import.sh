#!/bin/bash

cd "$(dirname "$0")" || exit 1

npm run cdk -- import -m resource-mapping-ImportedCodeConnectionStack.json ImportedCodeConnectionStack
