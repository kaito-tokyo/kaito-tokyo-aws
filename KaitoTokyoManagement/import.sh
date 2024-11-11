#!/bin/bash

cd "$(dirname "$0")" || exit 1

npx aws-cdk import -r resource-mapping.json ImportedControlTowerIdentitiesStack ImportedCodeConnectionStack
