const knex = require('../knex');

module.exports = {
  find: (args) => {
    let table = knex('account').select('account.*').innerJoin('user','user.id','account.id_user').innerJoin('bank','bank.id','account.id_bank')
    if (args) {
      table = table.whereRaw(args.query, args.binding);
    }
    return table;
  },
  get: (id) => {
    return knex('account').where({ id }).first();
  },
  post: (data) => {
    return knex('account').insert(data);
  },
  put: (id, data) => {
    return knex('account').where({ id }).update(data);
  },
  delete: (id) => {
    return knex('account').where({ id }).del();
  }  
}
