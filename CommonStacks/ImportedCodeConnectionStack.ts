import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

import { aws_codeconnections as codeconnections, aws_iam as iam } from "aws-cdk-lib";

export class ImportedCodeConnectionStack extends cdk.Stack {
	readonly githubCodeConnection: codeconnections.CfnConnection;
	readonly codeConnectionManagedPolicy: iam.ManagedPolicy;

	constructor(scope: Construct, id: string, props?: cdk.StackProps) {
		super(scope, id, { ...props, description: "Import the default CodeConnection" });

		this.githubCodeConnection = new codeconnections.CfnConnection(this, "GitHubCodeConnection", {
			connectionName: "KaitoTokyoGitHub"
		});
		this.githubCodeConnection.applyRemovalPolicy(cdk.RemovalPolicy.RETAIN);

		this.codeConnectionManagedPolicy = new iam.ManagedPolicy(this, "CodeConnectionManagedPolicy", {
			statements: [
				new iam.PolicyStatement({
					effect: iam.Effect.ALLOW,
					resources: [this.githubCodeConnection.attrConnectionArn],
					actions: [
						"codeconnections:GetConnection",
						"codeconnections:GetConnectionToken",
						"codeconnections:UseConnection"
					]
				})
			]
		});
	}
}
