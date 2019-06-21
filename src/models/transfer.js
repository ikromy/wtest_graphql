const knex = require('../knex');

module.exports = {
  find: (args) => {
    let table = knex('transfer').select('transfer.*')
      .innerJoin('account AS FA','FA.id','transfer.id_account_from')
      .innerJoin('user AS FU','FU.id','FA.id_user')
      .innerJoin('account AS TA','TA.id','transfer.id_account_to')
      .innerJoin('user AS TU','TU.id','TA.id_user')
    if (args) {
      table = table.whereRaw(args.query, args.binding);
    }
    return table;
  },
  get: (id) => {
    return knex('transfer').where({ id }).first();
  },
  post: (data) => {
    return knex('transfer').insert(data);
  },
  put: (id, data) => {
    return knex('transfer').where({ id }).update(data);
  },
  delete: (id) => {
    return knex('transfer').where({ id }).del();
  }  
}
