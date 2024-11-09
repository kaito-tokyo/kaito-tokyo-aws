import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

import {
	aws_codeconnections as codeconnections,
	aws_codestarconnections as codestarconnections
} from "aws-cdk-lib";

export class ImportedCodeConnectionStack extends cdk.Stack {
	readonly githubCodeConnection: codeconnections.CfnConnection;
	readonly githubCodeStarConnection: codestarconnections.CfnConnection;

	constructor(scope: Construct, id: string, props?: cdk.StackProps) {
		super(scope, id, props);

		this.githubCodeConnection = new codeconnections.CfnConnection(this, "GitHubCodeConnection", {
			connectionName: "KaitoTokyoGitHub"
		});
		this.githubCodeConnection.applyRemovalPolicy(cdk.RemovalPolicy.RETAIN);

		this.githubCodeStarConnection = new codestarconnections.CfnConnection(
			this,
			"GitHubCodeStarConnection",
			{
				connectionName: "KaitoTokyoGitHub"
			}
		);
		this.githubCodeStarConnection.applyRemovalPolicy(cdk.RemovalPolicy.RETAIN);
	}
}
