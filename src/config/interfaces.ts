export interface DatabaseConfig {
	port: number;
	host: string;
	username: string;
	password: string;
	database: string;
	synchronize: boolean;
	entities: Array<string>;
}

export interface SwaggerConfig {
	title: string;
	description: string;
	version: string;
}

export interface CognitoConfig {
	region: string;
	userPoolId: string;
}

export interface AWSConfig {
	accessKeyId: string;
	secretAccessKey: string;
	cognito: CognitoConfig;
}
