#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";

import { ImportedCodeConnectionStack } from "../lib/ImportedCodeConnectionStack.js";
import { MainStack } from "../lib/MainStack.js";

const app = new cdk.App();

const prod001 = {
	account: "147997151289",
	region: "us-east-1"
};

const importedCodeConnectionProd001 = new ImportedCodeConnectionStack(
	app,
	"GitHubActionsSelfHostedServiceCodeBuildProjectsImportedCodeConnectionStack",
	{
		env: prod001
	}
);

new MainStack(app, "GitHubActionsSelfHostedServiceCodeBuildProjectsMainStack", {
	env: prod001,
	importedCodeConnection: importedCodeConnectionProd001
});

app.synth();
