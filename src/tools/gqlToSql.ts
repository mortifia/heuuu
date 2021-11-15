// generate sql with sheme for build sql and info of actual resolver to match exatly to the request
export function gqlToSql(
  schemeSql: { _type: string; _: string },
  args: any[] | {}
) {
  switch (schemeSql._type) {
    case 'SELECT':
    case 'select':
      return gqlToSqlSelect(schemeSql, args)
    case 'INSERT':
    case 'insert':
      return gqlToSqlInsert(schemeSql, args)
    default:
      throw new Error('gqlToSql type of request not supported')
  }
}
/* EXAMPLE or return
  INSERT INTO films (code, title, did, date_prod, kind) VALUES
    ('B6717', 'Tampopo', 110, '1985-02-10', 'Comedy'),
    ('HG120', 'The Dinner Game', 140, DEFAULT, 'Comedy');
 */
function gqlToSqlInsert(schemeSql: { _type: string }, args: any[] | {}) {
  let sql = `INSERT INTO` // add the sql type (select | remove | insert | ect ect)
  return ''
}

function gqlToSqlSelect(
  schemeSql: { _type: string; _: string },
  args: any[] | {}
) {
  let sql = `SELECT` // add the sql type (select | remove | insert | ect ect)
  // add field requested to sql
  if (Array.isArray(args)) {
    args?.forEach((fieldRequired: String | Object, pos) => {
      if (typeof fieldRequired === 'string') {
        // @ts-ignore
        sql += `${pos === 0 ? '' : ','} ${schemeSql[fieldRequired]}`
      }
    })
  }
  // add table to sql
  sql += ` FROM ${schemeSql._}`
  return sql
}
