#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { ImportedControlTowerGroupsStack } from "../lib/ImportedControlTowerGroupsStack";

const app = new cdk.App();

new ImportedControlTowerGroupsStack(
	app,
	"IAMIdentityCenterAdminGroupsImportedControlTowerGroupsStack",
	{
		env: {
			account: "784179762749",
			region: "us-east-1"
		},
		identityStoreId: "d-90674974be"
	}
);

app.synth();
