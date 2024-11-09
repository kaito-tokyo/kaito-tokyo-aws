import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

import { ImportedCodeConnectionStack } from "./ImportedCodeConnectionStack.js";
import { createCodeBuildSource, MyCodeBuildProject } from "./MyCodeBuildProject.js";

interface CodeBuildManagerStackProps extends cdk.StackProps {
	readonly shortName: string;
	readonly importedCodeConnection: ImportedCodeConnectionStack;
}

export class CodeBuildManagerStack extends cdk.Stack {
	readonly importedCodeConnection: ImportedCodeConnectionStack;

	constructor(scope: Construct, id: string, props: CodeBuildManagerStackProps) {
		super(scope, id, props);

		this.importedCodeConnection = props.importedCodeConnection;

		const source = createCodeBuildSource("kaito-tokyo", "kaito-tokyo-aws");

		new MyCodeBuildProject(this, "CodeBuildManagerCodeBuildProject", {
			projectName: `CodeBuildManager${props.shortName}`,
			source,
			importCodeConnection: this.importedCodeConnection
		});
	}
}
