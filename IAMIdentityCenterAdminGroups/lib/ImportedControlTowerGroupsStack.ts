import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

import { aws_identitystore as identitystore } from "aws-cdk-lib";

interface ImportedControlTowerGroupsStackProps extends cdk.StackProps {
	readonly identityStoreId: string;
}

export class ImportedControlTowerGroupsStack extends cdk.Stack {
	readonly accountFactory: identitystore.CfnGroup;
	readonly logArchiveViewers: identitystore.CfnGroup;
	readonly serviceCatalogAdmins: identitystore.CfnGroup;
	readonly securityAuditors: identitystore.CfnGroup;
	readonly logArchiveAdmins: identitystore.CfnGroup;
	readonly auditAccountAdmins: identitystore.CfnGroup;
	readonly securityAuditPowerUsers: identitystore.CfnGroup;
	readonly controlTowerAdmins: identitystore.CfnGroup;

	constructor(scope: Construct, id: string, props: ImportedControlTowerGroupsStackProps) {
		super(scope, id, props);

		const { identityStoreId } = props;

		this.accountFactory = new identitystore.CfnGroup(this, "AccountFactory", {
			displayName: "AWSAccountFactory",
			identityStoreId
		});

		this.logArchiveViewers = new identitystore.CfnGroup(this, "LogArchiveViewers", {
			displayName: "AWSLogArchiveViewers",
			identityStoreId
		});

		this.serviceCatalogAdmins = new identitystore.CfnGroup(this, "ServiceCatalogAdmins", {
			displayName: "AWSServiceCatalogAdmins",
			identityStoreId
		});

		this.securityAuditors = new identitystore.CfnGroup(this, "SecurityAuditors", {
			displayName: "AWSSecurityAuditors",
			identityStoreId
		});

		this.logArchiveAdmins = new identitystore.CfnGroup(this, "LogArchiveAdmins", {
			displayName: "AWSLogArchiveAdmins",
			identityStoreId
		});

		this.auditAccountAdmins = new identitystore.CfnGroup(this, "AuditAccountAdmins", {
			displayName: "AWSAuditAccountAdmins",
			identityStoreId
		});

		this.securityAuditPowerUsers = new identitystore.CfnGroup(this, "SecurityAuditPowerUsers", {
			displayName: "AWSSecurityAuditPowerUsers",
			identityStoreId
		});

		this.controlTowerAdmins = new identitystore.CfnGroup(this, "ControlTowerAdmins", {
			displayName: "AWSControlTowerAdmins",
			identityStoreId
		});
	}
}
