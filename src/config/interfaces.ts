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
	s3: S3Config;
}

export interface S3Config {
	bucket: string;
	getUrlTtl: number;
	postUrlTtl: number;
	region: string;
}

export interface CarConfig {
	maxImageSize: number;
	maxImagesCount: number;
}

export interface PaypalConfig {
	clientId: string;
	secret: string;
	apiUrl: string;
}

export interface PayoutConfig {
	serviceFeePercentage: number;
}
