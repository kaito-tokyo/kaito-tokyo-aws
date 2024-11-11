import {
  IdentitystoreClient,
  ListUsersCommand,
  type User,
} from "@aws-sdk/client-identitystore";

interface IdentitystoreRepositoryProps {
  readonly region: string;
  readonly identityStoreId: string;
}

export function findUserIdByEmail(users: User[], email: string): string {
  const user = users.find((user) => {
    const PrimaryEmail = user.Emails?.find((Email) => Email.Primary);
    return PrimaryEmail?.Value === email;
  });

  if (!user?.UserId) {
    throw new Error(`User not found by email: ${email}`);
  }

  return user.UserId;
}

export class IdentityStoreRepository {
  readonly identityStoreId: string;

  private readonly client: IdentitystoreClient;

  constructor({ region, identityStoreId }: IdentitystoreRepositoryProps) {
    this.identityStoreId = identityStoreId;

    this.client = new IdentitystoreClient({
      region,
    });
  }

  async listUsers(): Promise<User[]> {
    let users: User[] = [];
    let nextToken: string | undefined;
    do {
      const { NextToken, Users } = await this.client.send(
        new ListUsersCommand({
          IdentityStoreId: this.identityStoreId,
          MaxResults: 100,
          NextToken: nextToken,
        }),
      );
      nextToken = NextToken;
      users = [...users, ...(Users ?? [])];
    } while (nextToken);

    return users;
  }
}
