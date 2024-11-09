#!/bin/bash

cd "$(dirname "$0")" || exit 1

cdk import -m resource-mapping-ImportedControlTowerGroupsStack.json ImportedControlTowerGroupsStack
