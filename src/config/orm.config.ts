import configuration from './configuration';

const dbConfig = configuration().db;

export default {
  type: dbConfig.type,
  host: dbConfig.host,
  port: dbConfig.port,
  username: dbConfig.username,
  password: dbConfig.password,
  database: dbConfig.database,
  synchronize: dbConfig.synchronize,
  entities: dbConfig.ormEntities,
  migrations: dbConfig.migrations,
  subscribers: dbConfig.subscribers,
  cli: dbConfig.cli,
};
