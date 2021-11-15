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
function gqlToSqlInsert(
  schemeSql: { _type: string; _: string },
  args: any[] | {}
) {
  // add inser into & table & colums
  let sql = `INSERT INTO ${schemeSql._} (${Object.keys(schemeSql)
    .filter(key => key[0] !== '_')
    .join(', ')}) VALUES \n  ${gqlToSqlInsertData(schemeSql, args)}` // add the sql type (select | remove | insert | ect ect)
  // sert a dire ce que l'on veut du retour
  if (
    // @ts-ignore
    schemeSql._returning !== undefined && // @ts-ignore
    Array.isArray(schemeSql._returningField)
  ) {
    sql += `\nreturning` // @ts-ignore
    schemeSql._returningField.forEach((fieldRequired: String | Object, pos) => {
      if (typeof fieldRequired === 'string') {
        // @ts-ignore
        sql += `${pos === 0 ? '' : ','} ${schemeSql._returning[fieldRequired]}`
      }
    })
  }
  return sql
}

function gqlToSqlInsertData(
  schemeSql: { _type: string; _: string },
  args: any[] | {}
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
        // @ts-ignore
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
