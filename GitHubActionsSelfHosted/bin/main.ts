#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";

import { ImportedCodeConnectionStack } from "../lib/ImportedCodeConnectionStack.js";

import { infrastructureAccountIds } from "kaito-tokyo-aws-common-parameters";
import { GeneralRunnerStack } from "../lib/GeneralRunnerStack.js";
import { GitHubActionsSelfHostedBuilderStack } from "../lib/GitHubActionsSelfHostedBuilderStack.js";

const app = new cdk.App();

const importedCodeConnection = new ImportedCodeConnectionStack(app, "ImportedCodeConnectionStack", {
	env: {
		account: infrastructureAccountIds.gitHubSelfHostedProd001,
		region: "us-east-1"
	}
});

new GitHubActionsSelfHostedBuilderStack(app, "GitHubActionsSelfHostedBuilderStack", {
	env: {
		account: infrastructureAccountIds.gitHubSelfHostedProd001,
		region: "us-east-1"
	},
	importedCodeConnection
});

new GeneralRunnerStack(app, "GeneralRunnerStack", {
	env: {
		account: infrastructureAccountIds.gitHubSelfHostedProd001,
		region: "us-east-1"
	},
	importedCodeConnection
});

app.synth();
