#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";

import { ImportedCodeConnectionStack } from "../lib/ImportedCodeConnectionStack.js";
import { ServiceCodeBuildProjectsStack } from "../lib/ServiceCodeBuildProjectsStack.js";
import { CodeBuildManagerStack } from "../lib/CodeBuildManagerStack.js";
import { AssumeRoleManagerStack } from "../lib/AssumeRoleManagerStack.js";

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

new CodeBuildManagerStack(
	app,
	"GitHubActionsSelfHostedServiceCodeBuildProjectsCodeBuildManagerStack",
	{
		env: prod001,
		importedCodeConnection: importedCodeConnectionProd001,
		shortName: "Prod001"
	}
);

new AssumeRoleManagerStack(
	app,
	"GitHubActionsSelfHostedServiceCodeBuildProjectsAssumeRoleManagerStack",
	{
		env: prod001,
		importedCodeConnection: importedCodeConnectionProd001,
		shortName: "Prod001"
	}
);

new ServiceCodeBuildProjectsStack(
	app,
	"GitHubActionsSelfHostedServiceCodeBuildProjectsServiceCodeBuildProjectsStack",
	{
		env: prod001,
		importedCodeConnection: importedCodeConnectionProd001
	}
);

app.synth();
