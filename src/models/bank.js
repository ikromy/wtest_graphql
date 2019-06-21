const knex = require('../knex');

module.exports = {
  find: (args) => {
    let table = knex('bank')
    if (args) {
      table = table.whereRaw(args.query, args.binding);
    }
    return table;
  },
  get: (id) => {
    return knex('bank').where({ id }).first();
  },
  post: (data) => {
    return knex('bank').insert(data);
  },
  put: (id, data) => {
    return knex('bank').where({ id }).update(data);
  },
  delete: (id, args) => {
    return knex('bank').where({ id }).del();
  }  
}
