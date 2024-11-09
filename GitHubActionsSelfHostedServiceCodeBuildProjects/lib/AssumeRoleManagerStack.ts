import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

import { aws_iam as iam } from "aws-cdk-lib";

import { ImportedCodeConnectionStack } from "./ImportedCodeConnectionStack.js";
import { createCodeBuildSource, MyCodeBuildProject } from "./MyCodeBuildProject.js";

interface AssumeRoleManagerStackProps extends cdk.StackProps {
	readonly shortName: string;
	readonly importedCodeConnection: ImportedCodeConnectionStack;
}

export class AssumeRoleManagerStack extends cdk.Stack {
	readonly importedCodeConnection: ImportedCodeConnectionStack;

	constructor(scope: Construct, id: string, props: AssumeRoleManagerStackProps) {
		super(scope, id, props);

		this.importedCodeConnection = props.importedCodeConnection;

		const source = createCodeBuildSource("kaito-tokyo", "kaito-tokyo-aws");

		const project = new MyCodeBuildProject(this, "AssumeRoleManagerCodeBuildProject", {
			projectName: `AssumeRoleManager${props.shortName}`,
			source,
			importCodeConnection: this.importedCodeConnection
		});

		project.role!.addManagedPolicy(
			iam.ManagedPolicy.fromAwsManagedPolicyName("AWSCloudFormationFullAccess")
		);
	}
}
