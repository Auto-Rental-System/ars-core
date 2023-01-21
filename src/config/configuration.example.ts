export default () => ({
	port: 5000,
	db: {
		type: 'db-type',
		host: 'db-host',
		port: 5432,
		database: 'db-name',
		username: 'db-user',
		password: 'db-password',
		synchronize: false,
		entities: ['dist/entity//*.{ts,js}'],
		ormEntities: ['src/entity//*.ts'],
		migrations: ['src/migration//*.ts'],
		subscribers: ['src/subscriber//*.ts'],
		cli: {
			entitiesDir: 'src/entity',
			migrationsDir: 'src/migration',
			subscribersDir: 'src/subscriber',
		},
	},
	swagger: {
		title: 'Boilerplate',
		description: 'NestJS Boilerplate',
	},
	aws: {
		accessKeyId: 'your-aws-accessKeyId',
		secretAccessKey: 'your-aws-secretAccessKey',
		cognito: {
			region: 'your-aws-region',
			userPoolId: 'your-aws-region',
		},
	},
	car: {
		maxImageSize: 2097152, // 2Mb
		maxImagesCount: 10,
	},
	paypal: {
		clientId: 'client_id',
		secret: 'secret',
		// For Sandbox: https://api-m.sandbox.paypal.com
		// For Live: https://api-m.paypal.com
		apiUrl: 'https://api-m.paypal.com',
		webhookId: 'your-paypal-webhook-id',
	},
	payout: {
		serviceFeePercentage: 5,
	},
});
