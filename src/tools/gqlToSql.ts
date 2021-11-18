// generate sql with sheme for build sql and info of actual resolver to match exatly to the request
export function gqlToSql(schemeSql: { [key: string]: any }, args: any[] | {}) {
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
function gqlToSqlInsert(schemeSql: { [key: string]: any }, args: any[] | {}) {
  // add inser into & table & colums
  let sql = `INSERT INTO ${schemeSql._} (${Object.keys(schemeSql)
    .filter(key => key[0] !== '_')
    .join(', ')}) VALUES \n  ${gqlToSqlInsertData(schemeSql, args)}` // add the sql type (select | remove | insert | ect ect)
  // sert a dire ce que l'on veut du retour
  if (
    schemeSql._returning !== undefined &&
    Array.isArray(schemeSql._returningField)
  ) {
    sql += `\nreturning`
    schemeSql._returningField.forEach((fieldRequired: String | Object, pos) => {
      if (typeof fieldRequired === 'string') {
        sql += `${pos === 0 ? '' : ','} ${schemeSql._returning[fieldRequired]}`
      }
    })
  }
  return sql
}

function gqlToSqlInsertData(
  schemeSql: { [key: string]: any },
  args: any[] | { [key: string]: any }
) {
  if (Array.isArray(args)) {
    let tmp: string[] = []
    args!.forEach((row: {}, pos) => {
      tmp.push(gqlToSqlInsertData(schemeSql, row))
    })
    return tmp.join(',\n  ')
  } else {
    // finish with only undefine security
    let sql = '('
    Object.keys(schemeSql)
      .filter(key => key[0] !== '_')
      .forEach((collumn, pos) => {
        const value = args[collumn]
        value === undefined
          ? (sql += `${pos === 0 ? '' : ', '}NULL`)
          : (sql += `${pos === 0 ? '' : ', '}${
              isNaN(value) ? `'${value}'` : value
            }`)
      })
    return (sql += ')')
  }
}

function gqlToSqlSelect(
  schemeSql: { [key: string]: any },
  args: any[] | { [key: string]: any }
) {
  let sql = `SELECT` // add the sql type (select | remove | insert | ect ect)
  // add field requested to sql
  if (Array.isArray(args)) {
    args?.forEach((fieldRequired: String | Object, pos) => {
      if (typeof fieldRequired === 'string') {
        sql += `${pos === 0 ? '' : ','} ${schemeSql[fieldRequired]}`
      }
    })
  } else {
    args._column.forEach((fieldRequired: String | Object, pos: number) => {
      if (typeof fieldRequired === 'string') {
        sql += `${pos === 0 ? '' : ','} ${schemeSql[fieldRequired]}`
      }
    })
    if (
      args._pageInfo !== undefined &&
      args._pageInfo !== null &&
      args._pageInfo !== false
    ) {
      sql += `, ${schemeSql._pageInfo}`
    }
  }
  // add table to sql
  sql += ` FROM ${schemeSql._}`
  // add limit and offset
  if (!Array.isArray(args)) {
    sql += `\n  LIMIT ${args._pagination.size || 50}${
      args._pagination.page >= 0
        ? '\n  OFFSET ' + args._pagination.size * args._pagination.page
        : ''
    }`
  }
  return sql
}
