import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

import { aws_codebuild as codebuild, aws_iam as iam } from "aws-cdk-lib";

import { ImportedCodeConnectionStack } from "./ImportedCodeConnectionStack.js";

export interface ManagementBuilderStackProps extends cdk.StackProps {
	readonly importedCodeConnection: ImportedCodeConnectionStack;
}

export class ManagementBuilderStack extends cdk.Stack {
	constructor(scope: Construct, id: string, props: ManagementBuilderStackProps) {
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
			projectName: "ManagementBuilder",
			source: codebuild.Source.gitHub({
				owner: "kaito-tokyo",
				repo: "kaito-tokyo-aws",
				webhook: true,
				webhookFilters: [
					codebuild.FilterGroup.inEventOf(codebuild.EventAction.PUSH).andBranchIs("main")
				]
			}),
			environment: {
				buildImage: codebuild.LinuxArmLambdaBuildImage.AMAZON_LINUX_2023_NODE_20
			},
			buildSpec: codebuild.BuildSpec.fromSourceFilename("KaitoToktoManagement/buildspec.yml")
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
