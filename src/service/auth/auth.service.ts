import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
	GetUserCommand,
	GetUserCommandInput,
	GetUserCommandOutput,
	CognitoIdentityProviderClient,
	AdminGetUserCommand,
	AdminGetUserCommandInput,
	AdminUpdateUserAttributesCommand,
	AdminUpdateUserAttributesCommandInput,
	AttributeType,
} from '@aws-sdk/client-cognito-identity-provider';

import { CognitoConfig, AWSConfig } from 'config/interfaces';
import { ApplicationError } from 'shared/error';

@Injectable()
export class AuthService {
	private readonly client: CognitoIdentityProviderClient;
	private readonly cognitoConfig: CognitoConfig;

	public static userIdAttributeName = 'custom:user_id';

	constructor(
		private readonly configService: ConfigService
	) {
		const awsConfig: AWSConfig = this.configService.get<AWSConfig>('aws') as AWSConfig;
		this.cognitoConfig = awsConfig.cognito;

		this.client = new CognitoIdentityProviderClient({
			region: awsConfig.cognito.region,
			credentials: {
				accessKeyId: awsConfig.accessKeyId,
				secretAccessKey: awsConfig.secretAccessKey,
			},
		});
	}

	public async getCognitoAccount(token: string): Promise<GetUserCommandOutput> {
		const input: GetUserCommandInput = {
			AccessToken: token,
		};
		const command = new GetUserCommand(input);

		try {
			const account: GetUserCommandOutput = await this.client.send(command);
			return account;
		} catch (e) {}

		throw new NotValidTokenError('Not valid token');
	}

	public async ensureCognitoAccountExists(email: string): Promise<void> {
		const userExists = await this.checkCognitoAccountExist(email);

		if (!userExists) {
			throw new CognitoUserDoesNotExistsError();
		}
	}

	private async checkCognitoAccountExist(username: string): Promise<boolean> {
		const input: AdminGetUserCommandInput = {
			UserPoolId: this.cognitoConfig.userPoolId,
			Username: username,
		};

		const command = new AdminGetUserCommand(input);
		try {
			const response = await this.client.send(command);
			if (response) {
				return true;
			}
		} catch (e: any) {}

		return false;
	}

	// https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_AdminUpdateUserAttributes.html
	public async updateAccountAttributes(email: string, attributes: Record<string, string>): Promise<void> {
		const UserAttributes: Array<AttributeType> = Object.keys(attributes).map(key => {
			return {
				Name: key,
				Value: attributes[key] as string,
			}
		})

		const input: AdminUpdateUserAttributesCommandInput = {
			UserPoolId: this.cognitoConfig.userPoolId,
			Username: email,
			UserAttributes,
		};

		const command = new AdminUpdateUserAttributesCommand(input);

		await this.client.send(command);
	}

}

export class NotValidTokenError extends ApplicationError {}
export class CognitoUserDoesNotExistsError extends ApplicationError {}
