#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";

import { AdminGroupMembershipsStack } from "../lib/AdminGroupMembershipsStack.js";
import { EditorPermissionsStack } from "../lib/EditorPermissionsStack.js";
import { ImportedControlTowerIdentitiesStack } from "../lib/ImportedControlTowerIdentitiesStack.js";

import {
  managementAccountId,
  identityStoreId,
} from "kaito-tokyo-aws-common-parameters";
import { IdentityStoreRepository } from "../lib/IdentitystoreRepository.js";

const app = new cdk.App();

if (process.env["CDK_DEFAULT_ACCOUNT"] !== managementAccountId) {
  throw new Error("This stack must be deployed to the management account");
}

const identityStoreRepository = new IdentityStoreRepository({
  region: "ap-northeast-1",
  identityStoreId,
});

const users = await identityStoreRepository.listUsers();

// Async operations must be done before this line

const importedControlTowerIdentities = new ImportedControlTowerIdentitiesStack(
  app,
  "ImportedControlTowerIdentitiesStack",
  {
    env: {
      account: managementAccountId,
      region: "ap-northeast-1",
    },
    identityStoreId,
  },
);

new AdminGroupMembershipsStack(app, "AdminGroupMembershipsStack", {
  env: {
    account: managementAccountId,
    region: "ap-northeast-1",
  },
  identityStoreId,
  importedControlTowerIdentities,
  users,
});

new EditorPermissionsStack(app, "EditorPermissionsStack", {
  env: {
    account: managementAccountId,
    region: "ap-northeast-1",
  },
  importedControlTowerIdentities,
  users,
});

app.synth();
