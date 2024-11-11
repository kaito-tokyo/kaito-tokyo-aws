import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

import { aws_codebuild as codebuild, aws_iam as iam } from "aws-cdk-lib";

import { ImportedCodeConnectionStack } from "./ImportedCodeConnectionStack.js";

export interface ManagementDeploymentRunnerStackProps extends cdk.StackProps {
	readonly importedCodeConnection: ImportedCodeConnectionStack;
}

export class ManagementDeploymentRunnerStack extends cdk.Stack {
	constructor(scope: Construct, id: string, props: ManagementDeploymentRunnerStackProps) {
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

		const project = new codebuild.Project(this, "ManagementDeploymentRunnerCodeBuildProject", {
			projectName: "ManagementDeploymentRunner",
			source: codebuild.Source.gitHub({
				owner: "kaito-tokyo",
				webhook: true,
				webhookFilters: [
					codebuild.FilterGroup.inEventOf(codebuild.EventAction.WORKFLOW_JOB_QUEUED)
						.andRepositoryNameIs("kaito-tokyo-aws")
						.andBranchIs("main")
				]
			})
		});

		project.role!.addManagedPolicy(codeConnectionManagedPolicy);
		project.node.addDependency(codeConnectionManagedPolicy);

		project.addToRolePolicy(
			new iam.PolicyStatement({
				effect: iam.Effect.ALLOW,
				resources: ["*"],
				actions: ["sts:AssumeRole"],
				conditions: {
					StringEquals: {
						"iam:ResourceTag/aws-cdk:bootstrap-role": [
							"image-publishing",
							"file-publishing",
							"deploy",
							"lookup"
						]
					}
				}
			})
		);
	}
}
