#!/bin/bash

cd "$(dirname "$0")" || exit 1

npx cdk import -m resource-mapping-ImportedControlTowerGroupsStack.json ImportedControlTowerGroupsStack
