import { IdentitystoreClient, ListUsersCommand, type User } from "@aws-sdk/client-identitystore";

export class IdentitystoreRepository {
	readonly identityStoreId: string;

	private readonly client: IdentitystoreClient;

	constructor(region: string, identityStoreId: string) {
		this.identityStoreId = identityStoreId;

		this.client = new IdentitystoreClient({
			region
		});
	}

	async listUsers(): Promise<User[]> {
		let users: User[] = [];
		let NextToken: string | undefined;
		do {
			const response = await this.client.send(new ListUsersCommand({
					IdentityStoreId: this.identityStoreId,
					MaxResults: 1,
					NextToken
			}));
			NextToken = response.NextToken;
			users = [...users, ...response.Users ?? []];
		} while (NextToken);

		return users;
	}
}

