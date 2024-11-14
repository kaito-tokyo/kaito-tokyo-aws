#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";

import { AdminGroupMembershipsStack } from "../lib/AdminGroupMembershipsStack.js";
import { EditorPermissionsStack } from "../lib/EditorPermissionsStack.js";
import { ImportedCodeConnectionStack } from "../lib/ImportedCodeConnectionStack.js";
import { ImportedControlTowerIdentitiesStack } from "../lib/ImportedControlTowerIdentitiesStack.js";
import { ManagementBuilderStack } from "../lib/ManagementBuilderStack.js";

import { managementAccountId, identityStoreId } from "kaito-tokyo-aws-commonparameters";
import { IdentityStoreRepository } from "../lib/IdentitystoreRepository.js";

const app = new cdk.App();

if (process.env["CDK_DEFAULT_ACCOUNT"] !== managementAccountId) {
	throw new Error("This stack must be deployed to the management account");
}

const identityStoreRepository = new IdentityStoreRepository({
	region: "us-east-1",
	identityStoreId
});

const users = await identityStoreRepository.listUsers();

// Async operations must be done before this line

const importedControlTowerIdentities = new ImportedControlTowerIdentitiesStack(
	app,
	"ImportedControlTowerIdentitiesStack",
	{
		env: {
			account: managementAccountId,
			region: "us-east-1"
		},
		identityStoreId
	}
);

new AdminGroupMembershipsStack(app, "AdminGroupMembershipsStack", {
	env: {
		account: managementAccountId,
		region: "us-east-1"
	},
	identityStoreId,
	importedControlTowerIdentities,
	users
});

new EditorPermissionsStack(app, "EditorPermissionsStack", {
	env: {
		account: managementAccountId,
		region: "us-east-1"
	},
	importedControlTowerIdentities,
	users
});

const importedCodeConnection = new ImportedCodeConnectionStack(app, "ImportedCodeConnectionStack", {
	env: {
		account: managementAccountId,
		region: "us-east-1"
	}
});

new ManagementBuilderStack(app, "ManagementBuilderStack", {
	env: {
		account: managementAccountId,
		region: "us-east-1"
	},
	importedCodeConnection
});

app.synth();
