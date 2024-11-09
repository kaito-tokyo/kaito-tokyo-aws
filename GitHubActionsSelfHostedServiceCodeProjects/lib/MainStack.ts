import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

import { aws_codebuild as codebuild, aws_iam as iam } from "aws-cdk-lib";

import { ImportedCodeConnectionStack } from "./ImportedCodeConnectionStack.js";
import { KaitoTokyoCodeBuildProject } from "./KaitoTokyoCodeBuildProject.js";

interface MainStackProps extends cdk.StackProps {
	readonly importedCodeConnection: ImportedCodeConnectionStack;
}

export class MainStack extends cdk.Stack {
	readonly importedCodeConnection: ImportedCodeConnectionStack;

	createCodeConnectionManagedPolicy(
		importedCodeConnection: ImportedCodeConnectionStack
	): iam.ManagedPolicy {
		return new iam.ManagedPolicy(this, "CodeConnectionManagedPolicy", {
			statements: [
				new iam.PolicyStatement({
					effect: iam.Effect.ALLOW,
					resources: [
						importedCodeConnection.githubCodeConnection.attrConnectionArn,
						importedCodeConnection.githubCodeStarConnection.attrConnectionArn
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
	}

	createSource(repo: string): codebuild.Source {
		return codebuild.Source.gitHub({
			owner: "kaito-tokyo",
			webhook: true,
			webhookFilters: [
				codebuild.FilterGroup.inEventOf(
					codebuild.EventAction.WORKFLOW_JOB_QUEUED
				).andRepositoryNameIs(repo)
			]
		});
	}

	constructor(scope: Construct, id: string, props: MainStackProps) {
		super(scope, id, props);

		this.importedCodeConnection = props.importedCodeConnection;

		const codeConnectionManagedPolicy = this.createCodeConnectionManagedPolicy(
			this.importedCodeConnection
		);
		const source = this.createSource("kaito-tokyo-aws");

		new KaitoTokyoCodeBuildProject(this, "ObsChatTalkerDeployInfraDev001Project", {
			projectName: "ObsChatTalkerDeployInfraDev001",
			source,
			codeConnectionManagedPolicy
		});
	}
}
