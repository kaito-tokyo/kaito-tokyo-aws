import { Construct } from "constructs";

import { aws_codebuild as codebuild, aws_iam as iam } from "aws-cdk-lib";

import { ImportedCodeConnectionStack } from "./ImportedCodeConnectionStack.js";

interface MyCodeBuildProjectProps extends codebuild.ProjectProps {
	readonly importCodeConnection: ImportedCodeConnectionStack;
}

export function createCodeBuildSource(owner: string, repo: string): codebuild.Source {
	return codebuild.Source.gitHub({
		owner: owner,
		webhook: true,
		webhookFilters: [
			codebuild.FilterGroup.inEventOf(
				codebuild.EventAction.WORKFLOW_JOB_QUEUED
			).andRepositoryNameIs(repo)
		],
		reportBuildStatus: false
	});
}

export class MyCodeBuildProject extends codebuild.Project {
	readonly codeConnectionManagedPolicy: iam.ManagedPolicy;

	constructor(scope: Construct, id: string, props: MyCodeBuildProjectProps) {
		super(scope, id, props);

		this.codeConnectionManagedPolicy = new iam.ManagedPolicy(this, "CodeConnectionManagedPolicy", {
			statements: [
				new iam.PolicyStatement({
					effect: iam.Effect.ALLOW,
					resources: [
						props.importCodeConnection.githubCodeConnection.attrConnectionArn,
						props.importCodeConnection.githubCodeStarConnection.attrConnectionArn
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

		this.role!.addManagedPolicy(this.codeConnectionManagedPolicy);
		this.node.addDependency(this.codeConnectionManagedPolicy);

		this.addToRolePolicy(
			new iam.PolicyStatement({
				effect: iam.Effect.ALLOW,
				resources: [
					this.stack.formatArn({
						account: this.stack.account,
						service: "iam",
						resource: "role/cdk-*"
					})
				],
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
