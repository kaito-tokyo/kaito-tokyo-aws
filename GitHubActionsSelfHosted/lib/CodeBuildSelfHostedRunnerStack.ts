import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

import { aws_codebuild as codebuild, aws_iam as iam } from "aws-cdk-lib";

import { ImportedCodeConnectionStack } from "./ImportedCodeConnectionStack.js";
import { infrastructureAccountIds } from "kaito-tokyo-aws-common-parameters";

export interface CodeBuildSelfHostedRunnerStackProps extends cdk.StackProps {
	readonly importedCodeConnection: ImportedCodeConnectionStack;
}

export class CodeBuildSelfHostedRunnerStack extends cdk.Stack {
	createPolicyStatementForCDK(
		accountId: string,
		region: string,
		qualifier: string = "hnb659fds"
	): iam.PolicyStatement {
		return new iam.PolicyStatement({
			effect: iam.Effect.ALLOW,
			resources: [
				`arn:aws:iam::${accountId}:role/cdk-${qualifier}-cfn-exec-role-${accountId}-${region}`,
				`arn:aws:iam::${accountId}:role/cdk-${qualifier}-deploy-role-${accountId}-${region}`,
				`arn:aws:iam::${accountId}:role/cdk-${qualifier}-file-publishing-role-${accountId}-${region}`,
				`arn:aws:iam::${accountId}:role/cdk-${qualifier}-image-publishing-role-${accountId}-${region}`,
				`arn:aws:iam::${accountId}:role/cdk-${qualifier}-lookup-role-${accountId}-${region}`
			],
			actions: ["sts:AssumeRole"]
		});
	}

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

		const infrastructureRoute53ProdRole = new iam.Role(this, "KaitoTokyoAwsMainRole", {
			roleName: "KaitoTokyoAwsMainRole",
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
			this.createPolicyStatementForCDK(infrastructureAccountIds.route53Prod001, "us-east-1")
		);
	}
}
