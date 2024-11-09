import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

import { aws_identitystore as identitystore } from "aws-cdk-lib";

import { ImportedControlTowerGroupsStack } from "./ImportedControlTowerGroupsStack";

interface MainStackProps extends cdk.StackProps {
	readonly importedControlTowerGroups: ImportedControlTowerGroupsStack;
}

export class MainStack extends cdk.Stack {
	constructor(scope: Construct, id: string, props: MainStackProps) {
		super(scope, id, props);

		const { importedControlTowerGroups } = props;

		new identitystore.CfnGroupMembership(this, "UmireonControlTowerAdmins", {
			groupId: importedControlTowerGroups.controlTowerAdmins.attrGroupId,
			identityStoreId: importedControlTowerGroups.identityStoreId,
			memberId: {
				userId: "748804e8-70e1-708a-56f1-820f4ba90171"
			}
		});
	}
}
