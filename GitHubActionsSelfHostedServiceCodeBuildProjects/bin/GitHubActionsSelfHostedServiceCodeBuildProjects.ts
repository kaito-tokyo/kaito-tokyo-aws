#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";

import { ImportedCodeConnectionStack } from "../lib/ImportedCodeConnectionStack.js";
import { ServiceCodeBuildProjectsStack } from "../lib/ServiceCodeBuildProjectsStack.js";
import { CodeBuildManagerStack } from "../lib/CodeBuildManagerStack.js";

import { GitHubSelfHostedProd001 } from "account_ids";

const app = new cdk.App();

const importedCodeConnectionProd001 = new ImportedCodeConnectionStack(
	app,
	"GitHubActionsSelfHostedServiceCodeBuildProjectsImportedCodeConnectionStack",
	{
		env: {
			account: GitHubSelfHostedProd001,
			region: "us-east-1"
		}
	}
);

new CodeBuildManagerStack(
	app,
	"GitHubActionsSelfHostedServiceCodeBuildProjectsCodeBuildManagerStack",
	{
		env: {
			account: GitHubSelfHostedProd001,
			region: "us-east-1"
		},
		importedCodeConnection: importedCodeConnectionProd001,
		shortName: "Prod001"
	}
);

new ServiceCodeBuildProjectsStack(
	app,
	"GitHubActionsSelfHostedServiceCodeBuildProjectsServiceCodeBuildProjectsStack",
	{
		env: {
			account: GitHubSelfHostedProd001,
			region: "us-east-1"
		},
		importedCodeConnection: importedCodeConnectionProd001
	}
);

app.synth();
