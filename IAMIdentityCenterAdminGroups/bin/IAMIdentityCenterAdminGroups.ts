#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { ImportedControlTowerGroupsStack } from "../lib/ImportedControlTowerGroupsStack";
import { MainStack } from "../lib/MainStack";

const app = new cdk.App();

const env = {
	account: "784179762749",
	region: "us-east-1"
};

const importedControlTowerGroups = new ImportedControlTowerGroupsStack(
	app,
	"IAMIdentityCenterAdminGroupsImportedControlTowerGroupsStack",
	{
		env,
		identityStoreId: "d-90674974be"
	}
);

new MainStack(app, "IAMIdentityCenterAdminGroupsMainStack", {
	env,
	importedControlTowerGroups,
});

app.synth();
