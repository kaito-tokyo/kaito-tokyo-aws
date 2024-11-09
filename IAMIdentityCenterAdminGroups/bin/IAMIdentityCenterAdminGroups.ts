#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";

import { ImportedControlTowerGroupsStack } from "../lib/ImportedControlTowerGroupsStack.js";
import { MainStack } from "../lib/MainStack.js";

import { IdentitystoreRepository } from "../lib/IdentitystoreRepository.js";

const env = {
	account: "784179762749",
	region: "us-east-1"
};

const identityStoreId = "d-90674974be";

const identitystoreRepository = new IdentitystoreRepository(env.region, identityStoreId);
const users = await identitystoreRepository.listUsers();

const app = new cdk.App();

const importedControlTowerGroups = new ImportedControlTowerGroupsStack(
	app,
	"IAMIdentityCenterAdminGroupsImportedControlTowerGroupsStack",
	{
		env,
		identityStoreId
	}
);

new MainStack(app, "IAMIdentityCenterAdminGroupsMainStack", {
	env,
	importedControlTowerGroups,
	users
});

app.synth();
