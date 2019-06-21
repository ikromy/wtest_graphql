const knex = require('../knex');

module.exports = {
  find: (args) => {
    let table = knex('user')
    if (args) {
      table = table.whereRaw(args.query, args.binding);
    }
    return table;
  },
  get: (id) => {
    return knex('user').where({ id }).first();
  },
  post: (data) => {
    return knex('user').insert(data);
  },
  put: (id, data) => {
    return knex('user').where({ id }).update(data);
  },
  delete: (id) => {
    return knex('user').where({ id }).del();
  }  
}
