#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";

import { CICDBuilderStack } from "../lib/CICDBuilderStack.js";
import { ImportedCodeConnectionStack } from "kaito-tokyo-aws-commonstacks";
import { ObsChatTalkerBuilderStack } from "../lib/ObsChatTalkerBuilderStack.js";

import { infrastructureAccountIds, workloadsAccountIds } from "kaito-tokyo-aws-commonparameters";

const app = new cdk.App();

const importedCodeConnection = new ImportedCodeConnectionStack(app, "ImportedCodeConnectionStack", {
	env: {
		account: infrastructureAccountIds.gitHubSelfHostedProd001,
		region: "us-east-1"
	}
});

new CICDBuilderStack(app, "CICDBuilderStack", {
	env: {
		account: infrastructureAccountIds.gitHubSelfHostedProd001,
		region: "us-east-1"
	},
	importedCodeConnection
});

new ObsChatTalkerBuilderStack(app, "ObsChatTalkerBuilderStack", {
	env: {
		account: infrastructureAccountIds.gitHubSelfHostedProd001,
		region: "us-east-1"
	},
	importedCodeConnection,
	cdkDeployTargetEnrionments: [
		{
			account: workloadsAccountIds.obsChatTalkerDev001,
			region: "us-east-1"
		}
	]
});

app.synth();
