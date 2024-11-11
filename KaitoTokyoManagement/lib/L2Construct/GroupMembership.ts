import { Construct } from "constructs";

import { aws_identitystore as identitystore } from "aws-cdk-lib";

export interface GroupMembershipProps {
  readonly identityStoreId: string;
  readonly group: identitystore.CfnGroup;
  readonly userId: string;
}

export class GroupMembership extends Construct {
  readonly cfnGroupMembership: identitystore.CfnGroupMembership;

  constructor(scope: Construct, id: string, props: GroupMembershipProps) {
    super(scope, id);

    const { identityStoreId, group, userId } = props;

    this.cfnGroupMembership = new identitystore.CfnGroupMembership(
      this,
      "GroupMembership",
      {
        identityStoreId,
        groupId: group.attrGroupId,
        memberId: {
          userId,
        },
      },
    );
  }
}
