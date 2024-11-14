import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

import { aws_codebuild as codebuild, aws_iam as iam } from "aws-cdk-lib";

import { ImportedCodeConnectionStack } from "./ImportedCodeConnectionStack.js";

export interface CodeBuildSelfHostedRunnerStackProps extends cdk.StackProps {
	readonly importedCodeConnection: ImportedCodeConnectionStack;
}

export class CodeBuildSelfHostedRunnerStack extends cdk.Stack {
	constructor(scope: Construct, id: string, props: CodeBuildSelfHostedRunnerStackProps) {
		super(scope, id, props);

		const codeConnectionManagedPolicy = new iam.ManagedPolicy(this, "CodeConnectionManagedPolicy", {
			statements: [
				new iam.PolicyStatement({
					effect: iam.Effect.ALLOW,
					resources: [
						props.importedCodeConnection.githubCodeConnection.attrConnectionArn,
						props.importedCodeConnection.githubCodeStarConnection.attrConnectionArn
					],
					actions: [
						"codeconnections:GetConnection",
						"codeconnections:GetConnectionToken",
						"codeconnections:UseConnection",
						"codestar-connections:GetConnection",
						"codestar-connections:GetConnectionToken"
					]
				})
			]
		});

		const project = new codebuild.Project(this, "CDKRunnerCodeBuildProject", {
			projectName: "CDKRunner",
			source: codebuild.Source.gitHub({
				owner: "kaito-tokyo",
				webhook: true,
				webhookFilters: [codebuild.FilterGroup.inEventOf(codebuild.EventAction.WORKFLOW_JOB_QUEUED)]
			})
		});

		project.role!.addManagedPolicy(codeConnectionManagedPolicy);
		project.node.addDependency(codeConnectionManagedPolicy);

		const githubProvider = new iam.OpenIdConnectProvider(this, "GitHubProvider", {
			url: "https://token.actions.githubusercontent.com",
			clientIds: ["sts.amazonaws.com"]
		});

		const infrastructureRoute53ProdRole = new iam.Role(this, "InfrastructureRoute53ProdRole", {
			roleName: "InfrastructureRoute53ProdRole",
			assumedBy: new iam.FederatedPrincipal(
				githubProvider.openIdConnectProviderArn,
				{
					StringEquals: {
						"token.actions.githubusercontent.com:aud": "sts.amazonaws.com",
						"token.actions.githubusercontent.com:sub":
							"repo:kaito-tokyo/kaito-tokyo-aws:ref:refs/heads/main"
					}
				},
				"sts:AssumeRoleWithWebIdentity"
			)
		});

		infrastructureRoute53ProdRole.addToPolicy(
			new iam.PolicyStatement({
				effect: iam.Effect.ALLOW,
				resources: [
					"arn:aws:iam::913524900670:role/cdk-hnb659fds-cfn-exec-role-913524900670-us-east-1",
					"arn:aws:iam::913524900670:role/cdk-hnb659fds-deploy-role-913524900670-us-east-1",
					"arn:aws:iam::913524900670:role/cdk-hnb659fds-file-publishing-role-913524900670-us-east-1",
					"arn:aws:iam::913524900670:role/cdk-hnb659fds-image-publishing-role-913524900670-us-east-1",
					"arn:aws:iam::913524900670:role/cdk-hnb659fds-lookup-role-913524900670-us-east-1"
				],
				actions: ["sts:AssumeRole"]
			})
		);
	}
}
