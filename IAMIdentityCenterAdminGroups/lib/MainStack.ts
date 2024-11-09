import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

import { aws_identitystore as identitystore } from "aws-cdk-lib";

import { ImportedControlTowerGroupsStack } from "./ImportedControlTowerGroupsStack.js";

import { type User } from "@aws-sdk/client-identitystore";

interface MainStackProps extends cdk.StackProps {
	readonly importedControlTowerGroups: ImportedControlTowerGroupsStack;
	readonly users: User[];
}

export class MainStack extends cdk.Stack {
	findUserIdByEmail(users: User[], email: string): string {
		const user = users.find((user) => {
			const PrimaryEmail = user.Emails?.find((Email) => Email.Primary);
			return PrimaryEmail?.Value === email;
		});
		if (!user?.UserId) {
			throw new Error(`User not found by email: ${email}`);
		}
		return user.UserId;
	}

	constructor(scope: Construct, id: string, props: MainStackProps) {
		super(scope, id, props);

		const { importedControlTowerGroups, users } = props;

		const umireonUserId = this.findUserIdByEmail(users, "umireon@kaito.tokyo");

		new identitystore.CfnGroupMembership(this, "UmireonControlTowerAdmins", {
			groupId: importedControlTowerGroups.controlTowerAdmins.attrGroupId,
			identityStoreId: importedControlTowerGroups.identityStoreId,
			memberId: {
				userId: umireonUserId
			}
		});
	}
}
