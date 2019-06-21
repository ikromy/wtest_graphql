module.exports = {
  server: {
    port: 9999
  },
  jwt: {
    key: 'wallex'
  },
  db: {
    client: 'mysql2',
    version: '5.7',
    debug: false,
    connection: {
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'wallex'
    }
  }
}
