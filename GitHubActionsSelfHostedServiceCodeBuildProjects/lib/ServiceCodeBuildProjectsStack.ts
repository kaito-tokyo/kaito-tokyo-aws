import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

import { MyCodeBuildProject, createCodeBuildSource } from "./MyCodeBuildProject.js";
import { ImportedCodeConnectionStack } from "./ImportedCodeConnectionStack.js";

interface ServiceCodeBuildProjectsStackProps extends cdk.StackProps {
	readonly importedCodeConnection: ImportedCodeConnectionStack;
}

export class ServiceCodeBuildProjectsStack extends cdk.Stack {
	readonly importedCodeConnection: ImportedCodeConnectionStack;

	constructor(scope: Construct, id: string, props: ServiceCodeBuildProjectsStackProps) {
		super(scope, id, props);

		this.importedCodeConnection = props.importedCodeConnection;

		const source = createCodeBuildSource("kaito-tokyo", "kaito-tokyo-aws");

		new MyCodeBuildProject(this, "ObsChatTalkerDeployInfraDev001CodeBuildProject", {
			projectName: "ObsChatTalkerDeployInfraDev001",
			source,
			importCodeConnection: this.importedCodeConnection
		});
	}
}
