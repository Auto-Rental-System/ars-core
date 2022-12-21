import configuration from './configuration';

export default () => {
  const dbConfig = configuration().db;

  return {
    type: dbConfig.type,
    host: dbConfig.host,
    port: dbConfig.port,
    database: dbConfig.database,
    username: dbConfig.username,
    password: dbConfig.password,
    synchronize: dbConfig.synchronize,
    entities: dbConfig.entities,
  };
};
