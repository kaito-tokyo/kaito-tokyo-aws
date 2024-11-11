import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

import { GroupMembership } from "./L2Construct/GroupMembership.js";
import { ImportedControlTowerIdentitiesStack } from "./ImportedControlTowerIdentitiesStack.js";

import type { User } from "@aws-sdk/client-identitystore";
import { findUserIdByEmail } from "./IdentitystoreRepository.js";

interface AdminGroupMembershipsStackProps extends cdk.StackProps {
  readonly identityStoreId: string;
  readonly importedControlTowerIdentities: ImportedControlTowerIdentitiesStack;
  readonly users: User[];
}

export class AdminGroupMembershipsStack extends cdk.Stack {
  constructor(
    scope: Construct,
    id: string,
    props: AdminGroupMembershipsStackProps,
  ) {
    super(scope, id, props);

    const { identityStoreId, importedControlTowerIdentities, users } = props;

    const umireonUserId = findUserIdByEmail(
      users,
      "umireon@kaito.tokyo",
    );

    new GroupMembership(this, "UmireonControlTowerAdminsMembership", {
      identityStoreId,
      group: importedControlTowerIdentities.controlTowerAdmins,
      userId: umireonUserId,
    });
  }
}
