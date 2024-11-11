import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

import {
  aws_identitystore as identitystore,
  aws_sso as sso,
} from "aws-cdk-lib";

interface ImportedControlTowerIdentitiesStackProps extends cdk.StackProps {
  readonly identityStoreId: string;
}

export class ImportedControlTowerIdentitiesStack extends cdk.Stack {
  readonly identityStoreId: string;

  readonly accountFactory: identitystore.CfnGroup;
  readonly logArchiveViewers: identitystore.CfnGroup;
  readonly serviceCatalogAdmins: identitystore.CfnGroup;
  readonly securityAuditors: identitystore.CfnGroup;
  readonly logArchiveAdmins: identitystore.CfnGroup;
  readonly auditAccountAdmins: identitystore.CfnGroup;
  readonly securityAuditPowerUsers: identitystore.CfnGroup;
  readonly controlTowerAdmins: identitystore.CfnGroup;

  readonly ssoInstance: sso.CfnInstance;

  readonly powerUserAccess: sso.CfnPermissionSet;
  readonly readOnlyAccess: sso.CfnPermissionSet;
  readonly organizationFullAccess: sso.CfnPermissionSet;
  readonly serviceCatalogAdminFullAccess: sso.CfnPermissionSet;
  readonly administratorAccess: sso.CfnPermissionSet;
  readonly serviceCatalogEndUserAccess: sso.CfnPermissionSet;

  constructor(
    scope: Construct,
    id: string,
    props: ImportedControlTowerIdentitiesStackProps,
  ) {
    super(scope, id, props);

    // identitystore
    const { identityStoreId } = props;
    this.identityStoreId = identityStoreId;

    this.accountFactory = new identitystore.CfnGroup(this, "AccountFactory", {
      displayName: "AWSAccountFactory",
      identityStoreId,
      description:
        "Read-only access to account factory in AWS Service Catalog for end users",
    });
    this.accountFactory.applyRemovalPolicy(cdk.RemovalPolicy.RETAIN);

    this.auditAccountAdmins = new identitystore.CfnGroup(
      this,
      "AuditAccountAdmins",
      {
        displayName: "AWSAuditAccountAdmins",
        identityStoreId,
        description: "Admin rights to cross-account audit account",
      },
    );
    this.auditAccountAdmins.applyRemovalPolicy(cdk.RemovalPolicy.RETAIN);

    this.controlTowerAdmins = new identitystore.CfnGroup(
      this,
      "ControlTowerAdmins",
      {
        displayName: "AWSControlTowerAdmins",
        identityStoreId,
        description:
          "Admin rights to AWS Control Tower core and provisioned accounts",
      },
    );
    this.controlTowerAdmins.applyRemovalPolicy(cdk.RemovalPolicy.RETAIN);

    this.logArchiveAdmins = new identitystore.CfnGroup(
      this,
      "LogArchiveAdmins",
      {
        displayName: "AWSLogArchiveAdmins",
        identityStoreId,
        description: "Admin rights to log archive account",
      },
    );
    this.logArchiveAdmins.applyRemovalPolicy(cdk.RemovalPolicy.RETAIN);

    this.logArchiveViewers = new identitystore.CfnGroup(
      this,
      "LogArchiveViewers",
      {
        displayName: "AWSLogArchiveViewers",
        identityStoreId,
        description: "Read-only access to log archive account",
      },
    );
    this.logArchiveViewers.applyRemovalPolicy(cdk.RemovalPolicy.RETAIN);

    this.securityAuditors = new identitystore.CfnGroup(
      this,
      "SecurityAuditors",
      {
        displayName: "AWSSecurityAuditors",
        identityStoreId,
        description: "Read-only access to all accounts for security audits",
      },
    );
    this.securityAuditors.applyRemovalPolicy(cdk.RemovalPolicy.RETAIN);

    this.securityAuditPowerUsers = new identitystore.CfnGroup(
      this,
      "SecurityAuditPowerUsers",
      {
        displayName: "AWSSecurityAuditPowerUsers",
        identityStoreId,
        description: "Power user access to all accounts for security audits",
      },
    );
    this.securityAuditPowerUsers.applyRemovalPolicy(cdk.RemovalPolicy.RETAIN);

    this.serviceCatalogAdmins = new identitystore.CfnGroup(
      this,
      "ServiceCatalogAdmins",
      {
        displayName: "AWSServiceCatalogAdmins",
        identityStoreId,
        description: "Admin rights to account factory in AWS Service Catalog",
      },
    );
    this.serviceCatalogAdmins.applyRemovalPolicy(cdk.RemovalPolicy.RETAIN);

    // sso
    this.ssoInstance = new sso.CfnInstance(this, "SSOInstance", {
      name: "MonoxerSSO",
    });
    this.ssoInstance.applyRemovalPolicy(cdk.RemovalPolicy.RETAIN);

    this.administratorAccess = new sso.CfnPermissionSet(
      this,
      "AdministratorAccess",
      {
        instanceArn: this.ssoInstance.attrInstanceArn,
        name: "AWSAdministratorAccess",
        description: "Provides full access to AWS services and resources",
        managedPolicies: ["arn:aws:iam::aws:policy/AdministratorAccess"],
        sessionDuration: "PT1H",
      },
    );
    this.administratorAccess.applyRemovalPolicy(cdk.RemovalPolicy.RETAIN);

    this.organizationFullAccess = new sso.CfnPermissionSet(
      this,
      "OrganizationFullAccess",
      {
        instanceArn: this.ssoInstance.attrInstanceArn,
        name: "AWSOrganizationFullAccess",
        description: "Provides full access to AWS Organizations",
        managedPolicies: ["arn:aws:iam::aws:policy/AWSOrganizationsFullAccess"],
        sessionDuration: "PT1H",
      },
    );
    this.organizationFullAccess.applyRemovalPolicy(cdk.RemovalPolicy.RETAIN);

    this.powerUserAccess = new sso.CfnPermissionSet(this, "PowerUserAccess", {
      instanceArn: this.ssoInstance.attrInstanceArn,
      name: "AWSPowerUserAccess",
      description:
        "Provides full access to AWS services and resources, but does not allow management of Users and groups",
      managedPolicies: ["arn:aws:iam::aws:policy/PowerUserAccess"],
      sessionDuration: "PT1H",
    });
    this.powerUserAccess.applyRemovalPolicy(cdk.RemovalPolicy.RETAIN);

    this.readOnlyAccess = new sso.CfnPermissionSet(this, "ReadOnlyAccess", {
      instanceArn: this.ssoInstance.attrInstanceArn,
      name: "AWSReadOnlyAccess",
      description:
        "This policy grants permissions to view resources and basic metadata across all AWS services",
      managedPolicies: ["arn:aws:iam::aws:policy/job-function/ViewOnlyAccess"],
      sessionDuration: "PT1H",
    });
    this.readOnlyAccess.applyRemovalPolicy(cdk.RemovalPolicy.RETAIN);

    this.serviceCatalogAdminFullAccess = new sso.CfnPermissionSet(
      this,
      "ServiceCatalogAdminFullAccess",
      {
        instanceArn: this.ssoInstance.attrInstanceArn,
        name: "AWSServiceCatalogAdminFullAccess",
        description:
          "Provides full access to AWS Service Catalog admin capabilities",
        managedPolicies: [
          "arn:aws:iam::aws:policy/AWSServiceCatalogAdminFullAccess",
        ],
        sessionDuration: "PT1H",
      },
    );
    this.serviceCatalogAdminFullAccess.applyRemovalPolicy(
      cdk.RemovalPolicy.RETAIN,
    );

    this.serviceCatalogEndUserAccess = new sso.CfnPermissionSet(
      this,
      "ServiceCatalogEndUserAccess",
      {
        instanceArn: this.ssoInstance.attrInstanceArn,
        name: "AWSServiceCatalogEndUserAccess",
        description:
          "Provides access to the AWS Service Catalog end user console",
        managedPolicies: [
          "arn:aws:iam::aws:policy/AWSServiceCatalogEndUserFullAccess",
        ],
        sessionDuration: "PT1H",
      },
    );
    this.serviceCatalogEndUserAccess.applyRemovalPolicy(
      cdk.RemovalPolicy.RETAIN,
    );
  }
}
