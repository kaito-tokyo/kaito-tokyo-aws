#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";

import { CICDBuilderStack } from "../lib/CICDBuilderStack.js";
import { ImportedCodeConnectionStack } from "kaito-tokyo-aws-commonstacks";
import { ObsChatTalkerBuilderStack } from "../lib/ObsChatTalkerBuilderStack.js";

import { infrastructureAccountIds, workloadsAccountIds } from "kaito-tokyo-aws-commonparameters";
import { GamingVPNBuilderStack } from "../lib/GamingVPNBuilderStack.js";
import { InfrastructureBuilderStack } from "../lib/InfrastructureBuilderStack.js";

const app = new cdk.App();

const importedCodeConnection = new ImportedCodeConnectionStack(app, "ImportedCodeConnectionStack", {
	env: {
		account: infrastructureAccountIds.cicdProd001,
		region: "us-east-1"
	}
});

new CICDBuilderStack(app, "CICDBuilderStack", {
	env: {
		account: infrastructureAccountIds.cicdProd001,
		region: "us-east-1"
	},
	importedCodeConnection
});

new InfrastructureBuilderStack(app, "InfrastructureBuilderStack", {
	env: {
		account: infrastructureAccountIds.cicdProd001,
		region: "us-east-1"
	},
	importedCodeConnection,
	cdkDeployTargetEnrionments: [
		{
			account: infrastructureAccountIds.route53Prod001,
			region: "us-east-1"
		}
	]
});

new ObsChatTalkerBuilderStack(app, "ObsChatTalkerBuilderStack", {
	env: {
		account: infrastructureAccountIds.cicdProd001,
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

new GamingVPNBuilderStack(app, "GamingVPNBuilderStack", {
	env: {
		account: infrastructureAccountIds.cicdProd001,
		region: "us-east-1"
	},
	importedCodeConnection,
	cdkDeployTargetEnrionments: [
		{
			account: workloadsAccountIds.gamingVPNProd001,
			region: "us-east-1"
		}
	]
});

app.synth();
